import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Cart } from '../models/cart';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = `${environment.cartUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Add item to cart or update quantity if already exists
   * @param bookId ID of the book to add
   * @param quantity Quantity to add (default: 1)
   * @returns Observable with updated cart item
   */
  addToCart(bookId: number, quantity: number = 1): Observable<Cart> {
    const params = new HttpParams()
      .set('bookId', bookId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<Cart>(`${this.apiUrl}/add`, null, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get all cart items for current user
   * @returns Observable with array of cart items
   */
  getCartItems(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/all`)
      .pipe(
        catchError(this.handleError)
      );
  }



  /**
   * Update cart item quantity
   * @param cartId ID of the cart item to update
   * @param newQuantity New quantity (must be > 0)
   * @returns Observable with updated cart item
   */
  updateCartItem(cartId: number, newQuantity: number): Observable<Cart> {
    if (newQuantity <= 0) {
      return throwError(() => new Error('Quantity must be greater than 0'));
    }

    const params = new HttpParams()
      .set('newQuantity', newQuantity.toString());

    return this.http.put<Cart>(`${this.apiUrl}/update/${cartId}`, null, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Remove item from cart
   * @param cartId ID of the cart item to remove
   * @returns Observable of void
   */
  deleteCartItem(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${cartId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Clear all items from cart
   * @returns Observable of void
   */
  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get cart item count (for badge)
   * @returns Observable with total item count
   */
  getItemCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   * @param error HttpErrorResponse
   * @returns Error observable
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}