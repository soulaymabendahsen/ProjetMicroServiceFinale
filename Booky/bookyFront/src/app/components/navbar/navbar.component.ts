import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0; // Initialize cart item count
  isLoading: boolean = false; // Preloader state

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchCartItemCount();
  }

  // Fetch the number of items in the cart
  fetchCartItemCount(): void {
    this.isLoading = true; // Show preloader

    this.cartService.getCartItems().subscribe(
      (data: any[]) => {
        this.cartItemCount = data.length; // Update cart item count
        this.isLoading = false; // Hide preloader on success
      },
      (error) => {
        console.error('Error fetching cart items:', error);
        this.isLoading = false; // Hide preloader on error
      }
    );
  }
}
