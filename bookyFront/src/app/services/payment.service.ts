import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../models/Payment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8085/payment'; // Adaptez selon votre URL backend

  constructor(private http: HttpClient) { }

  // Récupérer tous les paiements
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  // Générer une facture PDF
  downloadPaymentPDF(paymentId: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(`${this.apiUrl}/${paymentId}/invoice`, {
      headers: headers,
      responseType: 'blob'
    });
  }

  // Optionnel: Récupérer un paiement spécifique
  getPaymentById(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}`);
  }

  getPaymentStatus(sessionId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/payment-status?sessionId=${sessionId}`);
  }

  retryPayment(paymentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/retry`, { paymentId });
  }
 
  
  deletePayment(paymentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${paymentId}`);
  }
  
}
