import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/Books';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';
import { environment } from '../../../environments/environment';

const API_BASE_URL = environment.gatewayUrl;

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  loading = true;
  error = '';
  isAddingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.loadBook(id);
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
        console.log('Livre chargé:', book);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du livre';
        this.loading = false;
        console.error('Erreur:', error);
      },
    });
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/images/default-book.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL}/uploads/${imageUrl}`;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-book.jpg';
  }

  getLanguageDisplay(language: string): string {
    const languageMap: { [key: string]: string } = {
      FRANCAIS: 'Français',
      ANGLAIS: 'Anglais',
      ARABE: 'Arabe',
    };
    return languageMap[language] || language;
  }

  getRatingStars(rating: number | undefined): number[] {
    if (!rating) return [];
    return Array(Math.floor(rating)).fill(0);
  }

  addToCart(book: any): void {
    if (!book || !book.available) return;

    this.isAddingToCart = true;
    const quantity = 1;

    this.cartService.addToCart(book.id, quantity).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.showSuccess(`${book.title} ajouté au panier`);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout au panier:", err);
        this.isAddingToCart = false;
        this.showError(err.message || "Impossible d'ajouter au panier");
      },
    });
  }

  addToWishlist(book: Book): void {
    this.showSuccess(`${book.title} ajouté aux favoris`);
    console.log('Ajout aux favoris:', book);
  }

  private showSuccess(message: string): void {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message,
        type: 'success',
        icon: '✓',
      },
      duration: 3000,
      panelClass: ['top-center-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      politeness: 'polite',
    });
  }

  private showError(message: string): void {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message,
        type: 'error',
        icon: '!',
      },
      duration: 5000,
      panelClass: ['top-center-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      politeness: 'assertive',
    });
  }
}
