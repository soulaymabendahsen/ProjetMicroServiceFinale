import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Book } from 'src/app/models/Books';
import { BookService } from 'src/app/services/book.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  sortedBooks: Book[] = [];
  sortAscending = true;
  private apiUrl = environment.apiUrl; // Utilisez toujours environment.apiUrl
  readonly LOW_STOCK_THRESHOLD = 5;
  readonly CRITICAL_STOCK_THRESHOLD = 2;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/default-book.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${this.apiUrl}/uploads/${imageUrl}`;
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data;
        this.filteredBooks = data;
        console.log('Livres chargés:', this.books);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des livres:', error);
      }
    });
  }

  toggleSort() {
    this.sortAscending = !this.sortAscending;
    this.sortBooks();
  }

  exportPdf() {
    this.bookService.exportBooksToPdf().subscribe((blob: Blob) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'liste_livres.pdf';
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    });
  }

  onImageError(event: any): void {
    console.error('Erreur de chargement de l\'image:', event.target.src);
    const imgUrl = event.target.getAttribute('data-original-src');
    if (imgUrl && imgUrl !== event.target.src) {
      console.log('Tentative de rechargement avec l\'URL originale:', imgUrl);
      event.target.src = imgUrl;
    } else {
      console.log('Utilisation de l\'image par défaut');
      event.target.src = 'assets/default-book.jpg';
    }
  }

  deleteLivre(id: number): void {
    console.log("Suppression du livre avec ID:", id);  
    
    if (confirm('Voulez-vous vraiment supprimer ce livre ?')) {
      this.bookService.deleteLivre(id).subscribe({
        next: () => {
          // Mise à jour instantanée du tableau
          this.books = this.books.filter(book => book.id !== id);
          this.filteredBooks = this.filteredBooks.filter(book => book.id !== id);
          console.log(`Livre avec ID ${id} supprimé avec succès`);
        },
        error: (error: any) => console.error('Erreur lors de la suppression du livre', error)
      });
    }
  }

  updateBook(id: number): void {
    const bookToUpdate = this.books.find(book => book.id === id);
    if (bookToUpdate) {
      const newTitle = prompt('Nouveau titre:', bookToUpdate.title);
      const newAuthor = prompt('Nouvel auteur:', bookToUpdate.author);
      const newPrice = prompt('Nouveau prix:', bookToUpdate.price.toString());
      
      if (newTitle && newAuthor && newPrice) {
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('author', newAuthor);
        formData.append('price', newPrice);
        // Ajoutez d'autres champs si nécessaire
  
        this.bookService.updateBook(id, formData).subscribe({
          next: () => {
            const index = this.books.findIndex(book => book.id === id);
            if (index !== -1) {
              this.books[index] = {
                ...this.books[index],
                title: newTitle,
                author: newAuthor,
                price: parseFloat(newPrice)
              };
              this.filteredBooks = [...this.books];
            }
            console.log(`Livre avec ID ${id} mis à jour avec succès`);
          },
          error: (error: any) => console.error('Erreur lors de la mise à jour du livre', error)
        });
      }
    }
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredBooks = this.books;
    } else {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  sortBooks() {
    this.filteredBooks.sort((a, b) => {
      return this.sortAscending 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
  }

  updatePromotion(bookId: number, event: any): void {
    const promotionPercent = parseInt(event.target.value);
    if (!isNaN(promotionPercent) && promotionPercent >= 0 && promotionPercent <= 100) {
      this.bookService.applyPromotion(bookId, promotionPercent).subscribe({
        next: (updatedBook: Book) => {
          console.log('Livre mis à jour:', updatedBook); // Pour le débogage
          const index = this.books.findIndex(b => b.id === bookId);
          if (index !== -1) {
            // S'assurer que tous les champs sont présents
            this.books[index] = {
              ...this.books[index],
              ...updatedBook,
              price: updatedBook.price || this.books[index].price,
              originalPrice: updatedBook.originalPrice || updatedBook.price || this.books[index].price,
              onSale: promotionPercent > 0,
              promotionPercent: promotionPercent
            };
            
            // Mettre à jour la liste filtrée
            const filteredIndex = this.filteredBooks.findIndex(b => b.id === bookId);
            if (filteredIndex !== -1) {
              this.filteredBooks[filteredIndex] = {...this.books[index]};
            }
          }
        },
        error: (error) => {
          console.error('Erreur lors de l\'application de la promotion:', error);
          event.target.value = this.books.find(b => b.id === bookId)?.promotionPercent || 0;
        }
      });
    }
  }

  getLowStockBooks(): Book[] {
    return this.books.filter(book => book.quantite < this.LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.quantite - b.quantite); // Trier par quantité croissante
  }

  isLowStock(quantity: number): boolean {
    return quantity < this.LOW_STOCK_THRESHOLD;
  }

  isCriticalStock(quantity: number): boolean {
    return quantity <= this.CRITICAL_STOCK_THRESHOLD;
  }
}
