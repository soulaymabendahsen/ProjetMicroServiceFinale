import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  message: string = '';

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCartItems();
  }

  getImageUrl(imageName: string): string {
    if (!imageName) return 'assets/icomoon/NOIMAGE.png';
    if (imageName.startsWith('http')) return imageName;
    return `${environment.gatewayUrl}/uploads/${imageName}`;
  }

  fetchCartItems(): void {
    this.cartService.getCartItems().subscribe(
      (data: Cart[]) => {
        this.cartItems = data;
        console.log('Fetched Cart Items:', this.cartItems);
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  updateCartItem(cartId: number, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateCartItem(cartId, newQuantity).subscribe({
      next: () => this.fetchCartItems(),
      error: (error) => {
        this.message = 'The stock is over';
        console.error('Error updating cart item:', error);
      },
    });
  }

  deleteCartItem(cartId: number): void {
    const isConfirmed = confirm(
      'Are you sure you want to remove this item from the cart?'
    );
    if (!isConfirmed) {
      this.message = 'Deletion canceled.';
      return;
    }

    this.cartService.deleteCartItem(cartId).subscribe({
      next: () => {
        this.message = 'Cart item deleted successfully!';
        this.fetchCartItems();
      },
      error: (error) => {
        this.message =
          error.message || error.error?.message || 'Failed to delete cart item';
        console.error('Error deleting cart item:', error);
      },
    });
  }

  getSubtotal(): number {
    if (!this.cartItems.length) return 0;

    const subtotal = this.cartItems.reduce(
      (total, item) =>
        total + (item.totalPrice || item.bookPrice * item.quantity),
      0
    );
    console.log('Subtotal Calculation:', {
      items: this.cartItems,
      calculatedSubtotal: subtotal,
    });
    return parseFloat(subtotal.toFixed(2));
  }

  getTax(): number {
    const tax = this.getSubtotal() * 0.1;
    return parseFloat(tax.toFixed(2));
  }

  getTotal(): number {
    const total = this.getSubtotal() + this.getTax();
    return parseFloat(total.toFixed(2));
  }

  proceedToCheckout(): void {
    const customerEmail = 'test@test.com';

    if (!this.cartItems.length) {
      this.message = 'Cannot checkout with an empty cart';
      return;
    }

    const cartId = this.cartItems[0].id;
    const checkoutUrl = `${environment.gatewayUrl}/payment/create-session`;

    this.http
      .post<{ url: string }>(checkoutUrl, null, {
        params: {
          cartId: cartId.toString(),
          customerEmail,
        },
      })
      .subscribe({
        next: (response) => {
          window.location.href = response.url;
        },
        error: (error) => {
          this.message = 'Error creating checkout session: ' + error.message;
          console.error('Checkout error:', error);
        },
      });
  }
}
