import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Book, Language } from '../../models/Books';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {
  book: any = {
    title: '',
    author: '',
    genre: '',
    price: 0,
    available: false,
    imagePath: '',
    imageUrl: '',
    publicationDate: new Date().toISOString().split('T')[0],
    rating: 0,
    soldQuantity: 0,
    onSale: false,
    promotionPercent: 0,
    quantite: 0,
    language: Language.FRANCAIS,
    resume: ''
  };
  selectedFile: File | null = null;
  bookId!: number;
  languages = Language; // Pour accéder à l'enum dans le template

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.params['id'];
    this.loadBookData();
  }

  loadBookData(): void {
    this.bookService.getBookById(this.bookId).subscribe({
      next: (data) => {
        this.book = data;
        // Générer l'URL complète de l'image
        if (this.book.imagePath) {
          this.book.imageUrl = this.getFullImageUrl(this.book.imagePath);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du livre', error);
        alert('Impossible de charger les données du livre');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Utilisez le endpoint d'API pour les images
    return `${environment.apiUrl}/uploads/${imagePath}`;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Aperçu de la nouvelle image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.book.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const bookJson = JSON.stringify({
        title: this.book.title,
        author: this.book.author,
        genre: this.book.genre,
        price: this.book.price,
        available: this.book.available,
        publicationDate: this.book.publicationDate,
        rating: this.book.rating,
        soldQuantity: this.book.soldQuantity,
        onSale: this.book.onSale,
        promotionPercent: this.book.promotionPercent,
        quantite: this.book.quantite,
        language: this.book.language,
        resume: this.book.resume
      });
    
      const formData = new FormData();
      formData.append('book', bookJson);
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
    
      this.bookService.updateBook(this.bookId, formData).subscribe({
        next: (response) => {
          if (response && response.imagePath) {
            this.book.imageUrl = this.getFullImageUrl(response.imagePath);
          }
          alert('Livre mis à jour avec succès!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur:', error);
          if (error.status === 415) {
            alert("Le serveur n'a pas accepté le format des données");
          } else {
            alert('Erreur lors de la mise à jour: ' + error.message);
          }
        }
      });
    }
  }

  isFormValid(): boolean {
    return (
      this.book.title.trim() !== '' &&
      this.book.author.trim() !== '' &&
      this.book.genre.trim() !== '' &&
      this.book.price > 0 &&
      this.book.publicationDate.trim() !== '' &&
      this.book.quantite >= 0
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}