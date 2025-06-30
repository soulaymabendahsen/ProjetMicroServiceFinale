import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book, Language } from '../../models/Books';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-books',
  templateUrl: './page-books.component.html',
  styleUrls: ['./page-books.component.css'],
})
export class PageBooksComponent implements OnInit, AfterViewInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  featuredBooks: Book[] = [];
  latestBooks: Book[] = [];
  bestRatedBooks: Book[] = [];
  onSaleBooks: Book[] = [];
  bestSellingBooks: Book[] = [];
  currentPage = 1;
  booksPerPage = 9;
  loading = true;
  swiper: Swiper | undefined;
  searchTerm: string = '';
  sortAscending: boolean = true;
  selectedLanguage: string = 'all';
  showPromotionsOnly: boolean = false;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadFeaturedBooks();
    this.loadLatestBooks();
    this.loadBestRatedBooks();
    this.loadOnSaleBooks();
    this.loadBestSellingBooks();
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper(): void {
    this.swiper = new Swiper('.product-swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      speed: 600,
      effect: 'slide',
      grabCursor: true,
      centeredSlides: false,
      initialSlide: 0,
      slideToClickedSlide: true,
      navigation: {
        nextEl: '.product-slider-button-next',
        prevEl: '.product-slider-button-prev',
        disabledClass: 'swiper-button-disabled',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 20, centeredSlides: true },
        640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
        992: { slidesPerView: 3, spaceBetween: 30, centeredSlides: false },
      },
      on: {
        init: () => console.log('Swiper initialized'),
        slideChange: () => console.log('Slide changed'),
        slideNextTransitionStart: () =>
          console.log('Next slide transition started'),
        slidePrevTransitionStart: () =>
          console.log('Previous slide transition started'),
      },
    });
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      },
    });
  }

  loadFeaturedBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => (this.featuredBooks = books.slice(0, 4)),
    });
  }

  loadLatestBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.latestBooks = [...books]
          .sort(
            (a, b) =>
              new Date(b.publicationDate).getTime() -
              new Date(a.publicationDate).getTime()
          )
          .slice(0, 4);
      },
    });
  }

  loadBestRatedBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.bestRatedBooks = [...books]
          .filter((book) => book.rating)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);
      },
    });
  }

  loadOnSaleBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.onSaleBooks = books.filter((book) => book.onSale).slice(0, 4);
      },
    });
  }

  loadBestSellingBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.bestSellingBooks = books;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
        this.loading = false;
      },
    });
  }

  toggleSort(): void {
    this.sortAscending = !this.sortAscending;
    this.applyFilter();
  }

  filterByLanguage(language: string): void {
    this.selectedLanguage = language;
    this.showPromotionsOnly = false;
    this.applyFilter();
  }

  togglePromotions(): void {
    this.showPromotionsOnly = !this.showPromotionsOnly;
    this.selectedLanguage = 'all';
    this.applyFilter();
  }

  filterByGenre(genre: string): void {
    this.searchTerm = genre;
    this.selectedLanguage = 'all';
    this.showPromotionsOnly = false;
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = [...this.books];

    if (this.selectedLanguage !== 'all') {
      const languageMap: { [key: string]: string } = {
        français: 'FRANCAIS',
        anglais: 'ANGLAIS',
        arabe: 'ARABE',
      };
      const languageValue = languageMap[this.selectedLanguage];
      filtered = filtered.filter((book) => book.language === languageValue);
    }

    if (this.showPromotionsOnly) {
      filtered = filtered.filter((book) => book.onSale);
    }

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          book.genre.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return this.sortAscending ? comparison : -comparison;
    });

    this.filteredBooks = filtered;
  }

  getFilterTitle(): string {
    if (this.showPromotionsOnly) return 'Livres en promotion';
    if (this.searchTerm && this.selectedLanguage === 'all')
      return `Résultats pour "${this.searchTerm}"`;
    switch (this.selectedLanguage) {
      case 'français':
        return 'Livres Français';
      case 'arabe':
        return 'Livres Arabes';
      case 'anglais':
        return 'Livres Anglais';
      default:
        return 'Tous nos livres';
    }
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/delivry.jpeg';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
      return imageUrl;
    return `${environment.gatewayUrl}${imageUrl}`;
  }

  onImageError(event: any): void {
    console.error("Erreur de chargement de l'image:", event.target.src);
    event.target.src = 'assets/delivry.jpeg';
  }

  getRatingStars(rating: number | undefined): number[] {
    return rating ? Array(Math.floor(rating)).fill(0) : [];
  }

  isAddingToCart = false;

  addToCart(book: any) {
    this.isAddingToCart = true;
    const quantity = 1;

    this.cartService.addToCart(book.id, quantity).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.showSuccess(`${book.title} added to cart`);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.isAddingToCart = false;
        this.showError(err.message || 'Failed to add to cart');
      },
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: { message, type: 'success', icon: '✓' },
      duration: 3000,
      panelClass: ['top-center-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      politeness: 'polite',
    });
  }

  private showError(message: string): void {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: { message, type: 'error', icon: '!' },
      duration: 5000,
      panelClass: ['top-center-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
      politeness: 'assertive',
    });
  }

  addToWishlist(book: Book): void {
    console.log('Adding to wishlist:', book);
  }

  getLanguageDisplay(language: string): string {
    const languageMap: { [key: string]: string } = {
      FRANCAIS: 'Français',
      ANGLAIS: 'Anglais',
      ARABE: 'Arabe',
    };
    return languageMap[language] || language;
  }

  nextPage(): void {
    this.currentPage++;
    this.loadBooks();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedLanguage = 'all';
    this.showPromotionsOnly = false;
    this.sortAscending = true;
    this.applyFilter();
  }
}
