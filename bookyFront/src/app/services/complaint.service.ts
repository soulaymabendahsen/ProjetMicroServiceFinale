import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Complaint, ComplaintStatistics } from '../models/complaint';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = environment.complaintUrl;

  constructor(private http: HttpClient) { }

  // Gestionnaire d'erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('Erreur HTTP détaillée:', error);

    if (error.status === 0) {
      // Erreur côté client ou problème de réseau
      console.error('Une erreur s\'est produite:', error.error);
      return throwError(() => new Error('Erreur de connexion au serveur. Vérifiez votre connexion réseau ou réessayez plus tard.'));
    } else {
      // Le backend a renvoyé un code d'état d'échec
      console.error(
        `Le backend a renvoyé le code ${error.status}, ` +
        `corps de la réponse: ${JSON.stringify(error.error)}`);
      return throwError(() => error);
    }
  }

  // Créer une nouvelle réclamation
  createComplaint(complaint: Complaint): Observable<Complaint> {
    console.log('URL de l\'API:', this.apiUrl);
    console.log('Données envoyées au serveur:', complaint);
    return this.http.post<Complaint>(this.apiUrl, complaint)
      .pipe(
        retry(1), // Réessayer une fois en cas d'échec
        catchError(this.handleError)
      );
  }

  // Récupérer toutes les réclamations avec pagination et filtres
  getComplaints(
    page: number = 1,
    limit: number = 10,
    status?: string,
    category?: string,
    priority?: string,
    userEmail?: string,
    sortBy: string = 'createdAt',
    sortOrder: string = 'desc'
  ): Observable<{ complaints: Complaint[], totalPages: number, currentPage: number, totalItems: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (status) params = params.set('status', status);
    if (category) params = params.set('category', category);
    if (priority) params = params.set('priority', priority);
    if (userEmail) params = params.set('userEmail', userEmail);

    return this.http.get<{ complaints: Complaint[], totalPages: number, currentPage: number, totalItems: number }>(
      this.apiUrl,
      { params }
    );
  }

  // Récupérer une réclamation par son ID
  getComplaintById(id: string): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une réclamation
  updateComplaint(id: string, complaint: Partial<Complaint>): Observable<Complaint> {
    console.log('URL de mise à jour:', `${this.apiUrl}/${id}`);
    console.log('Données envoyées pour la mise à jour:', complaint);
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, complaint)
      .pipe(
        retry(1), // Réessayer une fois en cas d'échec
        catchError(this.handleError)
      );
  }

  // Supprimer une réclamation
  deleteComplaint(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour le statut d'une réclamation
  updateStatus(id: string, status: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Ajouter une réponse admin
  addAdminResponse(id: string, adminResponse: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/${id}/admin-response`, { adminResponse });
  }

  // Marquer une réclamation comme résolue
  markAsResolved(id: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/${id}/resolve`, {});
  }

  // Obtenir des statistiques sur les réclamations
  getStatistics(): Observable<ComplaintStatistics> {
    return this.http.get<ComplaintStatistics>(`${this.apiUrl}/statistics/all`);
  }

  // Récupérer les réclamations d'un utilisateur par email
  getUserComplaints(email: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/user/${email}`);
  }
}
