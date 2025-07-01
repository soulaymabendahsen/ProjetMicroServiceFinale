import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/Books';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl; // Utilisez toujours environment.apiUrl

  constructor(private http: HttpClient) { }

  exportBooksToPdf() {
    return this.http.get(`${this.apiUrl}/LivrePdf`, {
      responseType: 'blob'
    });
  }

  // Méthode pour uploader l'image
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      responseType: 'text'
    });
}

  getUploadUrl(): string {
    return `${this.apiUrl}/upload`;
  }

  // Méthode pour ajouter un livre
  addBook(book: Book): Observable<Book> {
    // Ensure the date is in the past and properly formatted
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const apiBook = {
      ...book,
      publicationDate: book.publicationDate || yesterday.toISOString().split('T')[0],
      // Ensure originalPrice is set if not already
      originalPrice: book.originalPrice || book.price
    };

    console.log('Sending book data:', apiBook);
    return this.http.post<Book>(`${this.apiUrl}/AjoutLivre`, apiBook);
  }
  getBookById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/getbookbyid/${id}`);
  }

  updateBook(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateLivre/${id}`, formData).pipe(
      map((response: any) => {
        // Assurez-vous que l'URL de l'image est correctement formatée
        if (response && response.imagePath) {
          response.imageUrl = this.getFullImageUrl(response.imagePath);
        }
        return response;
      })
    );
  }

  private getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      console.log('No image path provided');
      return '';
    }
    if (imagePath.startsWith('http')) {
      console.log('Using full URL:', imagePath);
      return imagePath;
    }





    // Nettoyer le chemin de l'image
    let cleanPath = imagePath;
    // Supprimer les préfixes indésirables
    cleanPath = cleanPath.replace(/^\/+api\/books\/uploads\//, '');
    cleanPath = cleanPath.replace(/^\/+uploads\//, '');
    cleanPath = cleanPath.replace(/^\/+/, '');

    const fullUrl = `${this.apiUrl}/uploads/${cleanPath}`;
    console.log('Generated image URL:', fullUrl);
    return fullUrl;
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/ShowAllLivre`).pipe(
      map(books => {
        return books.map(book => {
          console.log('Processing book:', book.title);
          console.log('Original image path:', book.imageUrl);
          const processedBook = {
            ...book,
            imageUrl: book.imageUrl ? this.getFullImageUrl(book.imageUrl) : ''
          };
          console.log('Processed image URL:', processedBook.imageUrl);
          return processedBook;
        });
      })
    );
  }

  // Nouvelle méthode pour trier les livres côté client
  sortBooks(books: Book[], ascending: boolean = true): Book[] {
    return [...books].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return ascending
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    });
  }

  // Nouvelle méthode pour récupérer les livres avec pagination
  getBooksWithPagination(page: number = 1, limit: number = 9): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/ShowAllLivre`).pipe(
      map(books => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return books.slice(startIndex, endIndex).map(book => ({
          ...book,
          imageUrl: book.imageUrl ? this.getFullImageUrl(book.imageUrl) : ''
        }));
      })
    );
  }

  deleteLivre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteLivre/${id}`);
  }

  applyPromotion(bookId: number, promotionPercent: number): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/applyPromotion/${bookId}?promotionPercent=${promotionPercent}`, {});
  }
}