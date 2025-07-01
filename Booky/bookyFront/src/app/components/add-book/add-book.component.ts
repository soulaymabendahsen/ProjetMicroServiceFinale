import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book, Language } from '../../models/Books';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  book: Book = {
    title: '',
    author: '',
    genre: '',
    price: 0,
    originalPrice: 0,
    available: true,
    // Set publication date to yesterday to ensure it's in the past
    publicationDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    imageUrl: '',
    quantite: 0,
    language: Language.FRANCAIS,
    resume: ''
  };
  selectedFile: File | null = null;
  isSubmitting = false;
  uploadProgress = 0;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérification du type de fichier
      if (!file.type.match('image.*')) {
        alert('Seules les images sont autorisées');
        return;
      }

      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille maximale est de 5MB');
        return;
      }

      this.selectedFile = file;

      // Afficher un aperçu
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.book.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.isSubmitting || !this.isFormValid()) return;

    this.isSubmitting = true;
    this.uploadProgress = 0;

    if (this.selectedFile) {
      this.uploadImage();
    } else {
      this.addBook();
    }
  }

  private uploadImage(): void {
    if (!this.selectedFile) return;

    this.bookService.uploadImage(this.selectedFile).subscribe({
      next: (imageName) => {
        // Simplement utiliser le nom de fichier retourné
        this.book.imageUrl = imageName; // Ou `uploads/${imageName}` selon votre besoin
        this.addBook();
      },
      error: (err) => {
        console.error('Erreur upload image:', err);
        this.resetUploadState();
        alert('Erreur lors de l\'upload de l\'image');
      }
    });
}
  private addBook(): void {
    // Ensure the date is in the past
    const today = new Date();
    const bookDate = new Date(this.book.publicationDate);

    if (bookDate >= today) {
      alert('La date de publication doit être dans le passé');
      this.resetUploadState();
      return;
    }

    // Ensure originalPrice is set
    if (!this.book.originalPrice) {
      this.book.originalPrice = this.book.price;
    }

    this.bookService.addBook(this.book).subscribe({
      next: (response) => {
        console.log('Livre ajouté avec succès:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur ajout livre:', err);
        let errorMessage = 'Erreur lors de l\'ajout du livre';

        if (err.error && err.error.error) {
          errorMessage += ': ' + err.error.error;
        } else if (err.error && typeof err.error === 'string') {
          errorMessage += ': ' + err.error;
        } else if (err.message) {
          errorMessage += ': ' + err.message;
        }

        alert(errorMessage);
        this.resetUploadState();
      }
    });
  }

  private isFormValid(): boolean {
    return this.book.title.trim() !== '' &&
           this.book.author.trim() !== '' &&
           this.book.price > 0 &&
           this.book.quantite >= 0;
  }

  private resetUploadState(): void {
    this.isSubmitting = false;
    this.uploadProgress = 0;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}