import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  message: string = '';

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCartItems();
   
  }


  getImageUrl(imageName: string): string {
    if (!imageName) return 'assets/icomoon/NOIMAGE.png'; // Fallback image
    
    // If it's already a full URL (like from cloud storage)
    if (imageName.startsWith('http')) {
      return imageName;
    }
    
    // For local files stored in your Spring uploads folder
    return `http://localhost:8095/uploads/${imageName}`;
  }

  // Fetch cart items from the backend
  fetchCartItems(): void {
    this.cartService.getCartItems().subscribe(
      (data: Cart[]) => {
        this.cartItems = data;
        console.log('Fetched Cart Items:', this.cartItems); // Debug fetched items
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  // // Update the quantity of a cart item
  // updateCartItem(cartId: number, newQuantity: number): void {
  //   this.cartService.updateCartItem(cartId, newQuantity).subscribe(
  //     (response) => {
  //       this.message = 'Cart item updated successfully!';
  //       this.fetchCartItems(); // Refresh the cart items
  //     },
  //     (error) => {
  //       this.message = 'Failed to update cart item: ' + error.error.message;
  //       console.error('Error updating cart item:', error);
  //     }
  //   );
  // }

  // // Delete a cart item
  // deleteCartItem(cartId: number): void {
  //   const isConfirmed = confirm('Are you sure you want to remove this item from the cart?');

  //   if (isConfirmed) {
  //     this.cartService.deleteCartItem(cartId).subscribe(
  //       () => {
  //         this.message = 'Cart item deleted successfully!';
  //         this.fetchCartItems(); // Refresh the cart items
  //       },
  //       (error) => {
  //         this.message = 'Failed to delete cart item: ' + error.error.message;
  //         console.error('Error deleting cart item:', error);
  //       }
  //     );
  //   } else {
  //     this.message = 'Deletion canceled.';
  //   }
 // }
// Update the quantity of a cart item
updateCartItem(cartId: number, newQuantity: number): void {
  if (newQuantity < 1) return; // Prevent quantities below 1
  
  this.cartService.updateCartItem(cartId, newQuantity).subscribe({
    next: (response) => {
      this.fetchCartItems(); // Refresh the cart items
    },
    error: (error) => {
      // Safe error message handling
      this.message = 'The stock is over ';
      console.error('Error updating cart item:', error);
    }
  });
}

// getImageUrl(){
//   return this.cartService.getImageUrl();
// }

// Delete a cart item
deleteCartItem(cartId: number): void {
  const isConfirmed = confirm('Are you sure you want to remove this item from the cart?');

  if (isConfirmed) {
    this.cartService.deleteCartItem(cartId).subscribe({
      next: () => {
        this.message = 'Cart item deleted successfully!';
        this.fetchCartItems(); // Refresh the cart items
      },
      error: (error) => {
        // Safe error message handling
        this.message = error.message || 
                      error.error?.message || 
                      'Failed to delete cart item';
        console.error('Error deleting cart item:', error);
      }
    });
  } else {
    this.message = 'Deletion canceled.';
  }
}
  // getSubtotal(): number {
  //   const subtotal = this.cartItems.reduce((total, item) => total + item.price, 0);
  //   console.log('Subtotal Calculation:', subtotal); // Debug subtotal calculation
  //   return parseFloat(subtotal.toFixed(2)); // Round to 2 decimal places
  // }

  getSubtotal(): number {
    if (!this.cartItems || this.cartItems.length === 0) {
      return 0;
    }
  
    // Use totalPrice instead of price (since totalPrice = bookPrice * quantity)
    const subtotal = this.cartItems.reduce(
      (total, item) => total + (item.totalPrice || item.bookPrice * item.quantity), 
      0
    );
  
    console.log('Subtotal Calculation:', {
      items: this.cartItems,
      calculatedSubtotal: subtotal
    });
  
    return parseFloat(subtotal.toFixed(2));
  }
  
  getTax(): number {
    const tax = this.getSubtotal() * 0.1; // 10% tax
    return parseFloat(tax.toFixed(2)); // Round to 2 decimal places
  }
  
  getTotal(): number {
    const total = this.getSubtotal() + this.getTax();
    return parseFloat(total.toFixed(2)); // Round to 2 decimal places
  }
  proceedToCheckout(): void {
    const customerEmail = 'test@test.com';
    
    if (this.cartItems.length > 0) {
      const cartId = this.cartItems[0].id;
      
      this.http.post<{url: string}>('http://localhost:8085/payment/create-session', null, {
        params: {
          cartId: cartId.toString(),
          customerEmail: customerEmail
        }
      }).subscribe({
        next: (response) => {
          window.location.href = response.url;
        },
        error: (error) => {
          this.message = 'Error creating checkout session: ' + error.message;
          console.error('Checkout error:', error);
        }
      });
    } else {
      this.message = 'Cannot checkout with an empty cart';
    }
  }
}