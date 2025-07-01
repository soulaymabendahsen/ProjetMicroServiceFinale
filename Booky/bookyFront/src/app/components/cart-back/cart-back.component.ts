import { Component } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart-back',
  templateUrl: './cart-back.component.html',
  styleUrls: ['./cart-back.component.css'],
})
export class CartBackComponent {
  cartItems: Cart[] = [];
  message: string = '';
  searchTerm: string = '';
  filterCriteria: string = 'all';
  filteredCarts: Cart[] = [];

  selectedCartForQR: Cart | null = null;
  qrCodeSize = 160;
  qrErrorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M';

  showQRForCartId: number | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchCartItems();
  }

  filterCarts(): void {
    this.filteredCarts = this.cartItems.filter((cart) => {
      const matchesSearch =
        this.searchTerm === '' ||
        cart.bookTitle.toLowerCase().includes(this.searchTerm.toLowerCase());

      const cartDate = new Date(cart.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const matchesDateFilter =
        this.filterCriteria === 'all' ||
        (this.filterCriteria === 'today' && cartDate >= today) ||
        (this.filterCriteria === 'week' &&
          cartDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) ||
        (this.filterCriteria === 'month' &&
          cartDate >= new Date(today.getFullYear(), today.getMonth(), 1));

      return matchesSearch && matchesDateFilter;
    });
  }

  fetchCartItems(): void {
    this.cartService.getCartItems().subscribe(
      (data: Cart[]) => {
        this.cartItems = data;
        this.filteredCarts = [...this.cartItems];
        console.log('Fetched Cart Items:', this.cartItems);
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  getImageUrl(imageName: string): string {
    if (!imageName) return 'assets/icomoon/NOIMAGE.png';
    return `${environment.gatewayUrl}/uploads/${imageName}`;
  }

  generateQRPayload(cart: Cart): string {
    return JSON.stringify({
      cartId: cart.id,
      bookTitle: cart.bookTitle,
      totalPrice: cart.totalPrice,
      quantity: cart.quantity,
      date: new Date(cart.createdAt).toLocaleDateString(),
    });
  }

  openQRModal(cart: Cart): void {
    this.selectedCartForQR = cart;
  }

  closeQRModal(): void {
    this.selectedCartForQR = null;
  }

  toggleQRCode(cartId: number): void {
    this.showQRForCartId = this.showQRForCartId === cartId ? null : cartId;
  }
}
