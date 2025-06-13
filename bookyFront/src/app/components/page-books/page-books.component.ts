import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book, Language } from '../../models/Books';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';


const API_BASE_URL = 'http://localhost:8095';

@Component({
  selector: 'app-page-books',
  templateUrl: './page-books.component.html',
  styleUrls: ['./page-books.component.css']
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
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
          centeredSlides: true
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: false
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
          centeredSlides: false
        }
      },
      on: {
        init: () => {
          console.log('Swiper initialized');
        },
        slideChange: () => {
          console.log('Slide changed');
        },
        slideNextTransitionStart: () => {
          console.log('Next slide transition started');
        },
        slidePrevTransitionStart: () => {
          console.log('Previous slide transition started');
        }
      }
    });
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        console.log('Livres chargés depuis l\'API:', books);

        // Vérification des langues disponibles
        const languages = books.map(book => book.language);
        const uniqueLanguages = [...new Set(languages)];
        console.log('Langues disponibles dans les livres:', uniqueLanguages);

        // Comptage des livres par langue
        const languageCounts = uniqueLanguages.reduce((acc, lang) => {
          acc[lang] = books.filter(book => book.language === lang).length;
          return acc;
        }, {} as {[key: string]: number});
        console.log('Nombre de livres par langue:', languageCounts);

        this.books = books;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      }
    });
  }

  loadFeaturedBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        // Pour l'exemple, on prend les 4 premiers livres comme featured
        this.featuredBooks = books.slice(0, 4);
      }
    });
  }

  loadLatestBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        // On trie par date de publication et on prend les 4 plus récents
        this.latestBooks = [...books]
          .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime())
          .slice(0, 4);
      }
    });
  }

  loadBestRatedBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        // On filtre les livres avec une note et on prend les 4 mieux notés
        this.bestRatedBooks = [...books]
          .filter(book => book.rating)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);
      }
    });
  }

  loadOnSaleBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        // On filtre les livres en promotion et on prend les 4 premiers
        this.onSaleBooks = books.filter(book => book.onSale).slice(0, 4);
      }
    });
  }

  loadBestSellingBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        console.log('Tous les livres reçus:', books);
        // On affiche tous les livres sans filtrage
        this.bestSellingBooks = books;
        console.log('Livres affichés:', this.bestSellingBooks);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des livres:', error);
        this.loading = false;
      }
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
    console.log('Livres disponibles:', this.books);

    // Filtre par langue
    if (this.selectedLanguage !== 'all') {
      // Mapping des noms de langues affichés vers les valeurs de l'énumération
      const languageMap: {[key: string]: string} = {
        'français': 'FRANCAIS',
        'anglais': 'ANGLAIS',
        'arabe': 'ARABE'
      };

      const languageValue = languageMap[this.selectedLanguage];
      console.log('Filtrage par langue:', this.selectedLanguage, '→', languageValue);

      filtered = filtered.filter(book => {
        console.log('Livre:', book.title, 'Langue:', book.language);
        return book.language === languageValue;
      });

      console.log('Livres filtrés par langue:', filtered.length);
    }

    // Filtre par promotion
    if (this.showPromotionsOnly) {
      filtered = filtered.filter(book => book.onSale);
    }

    // Filtre par recherche
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.genre.toLowerCase().includes(search)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return this.sortAscending ? comparison : -comparison;
    });

    this.filteredBooks = filtered;
  }

  getFilterTitle(): string {
    if (this.showPromotionsOnly) {
      return 'Livres en promotion';
    }
    if (this.searchTerm && this.selectedLanguage === 'all') {
      return `Résultats pour "${this.searchTerm}"`;
    }
    switch (this.selectedLanguage) {
      case 'français': return 'Livres Français';
      case 'arabe': return 'Livres Arabes';
      case 'anglais': return 'Livres Anglais';
      default: return 'Tous nos livres';
    }
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return 'assets/delivry.jpeg';
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `${API_BASE_URL}${imageUrl}`;
  }

  onImageError(event: any): void {
    console.error('Erreur de chargement de l\'image:', event.target.src);
    event.target.src = 'assets/delivry.jpeg';
  }

  getRatingStars(rating: number | undefined): number[] {
    if (!rating) return [];
    return Array(Math.floor(rating)).fill(0);
  }

  isAddingToCart = false;

  addToCart(book: any) {
    this.isAddingToCart = true;
    const quantity = 1;

    this.cartService.addToCart(book.id, quantity).subscribe({
      next: (response) => {
        this.isAddingToCart = false;
        this.showSuccess(`${book.title} added to cart`);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        this.isAddingToCart = false;
        this.showError(err.message || 'Failed to add to cart');
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: message,
        type: 'success',
        icon: '✓'
      },
      duration: 3000,
      panelClass: ['top-center-snackbar'], // Changed this
      horizontalPosition: 'center',        // Center horizontally
      verticalPosition: 'top',             // Position at top
      politeness: 'polite'
    });
  }

  private showError(message: string): void {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: message,
        type: 'error',
        icon: '!'
      },
      duration: 5000,
      panelClass: ['top-center-snackbar'], // Changed this
      horizontalPosition: 'center',        // Center horizontally
      verticalPosition: 'top',             // Position at top
      politeness: 'assertive'
    });
  }

  addToWishlist(book: Book): void {
    // TODO: Implement add to wishlist functionality
    console.log('Adding to wishlist:', book);
  }

  // Méthode pour afficher la langue de manière lisible
  getLanguageDisplay(language: string): string {
    const languageMap: {[key: string]: string} = {
      'FRANCAIS': 'Français',
      'ANGLAIS': 'Anglais',
      'ARABE': 'Arabe'
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