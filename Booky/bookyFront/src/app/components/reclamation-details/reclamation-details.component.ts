import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint, ComplaintStatus } from '../../models/complaint';

@Component({
  selector: 'app-reclamation-details',
  templateUrl: './reclamation-details.component.html',
  styleUrls: ['./reclamation-details.component.css']
})
export class ReclamationDetailsComponent implements OnInit {
  complaintId: string = '';
  complaint: Complaint | null = null;
  loading = false;
  error = '';
  success = '';

  // Pour la mise à jour du statut
  statusForm!: FormGroup;
  statuses = Object.values(ComplaintStatus);

  // Pour la réponse admin
  responseForm!: FormGroup;
  submittingResponse = false;

  // Mode édition
  isAdmin = true; // À remplacer par une vérification d'authentification réelle

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private complaintService: ComplaintService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.complaintId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.complaintId) {
      this.error = 'ID de réclamation non valide';
      return;
    }

    this.initForms();
    this.loadComplaintDetails();
  }

  initForms(): void {
    this.statusForm = this.formBuilder.group({
      status: ['', Validators.required]
    });

    this.responseForm = this.formBuilder.group({
      adminResponse: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  loadComplaintDetails(): void {
    this.loading = true;
    this.complaintService.getComplaintById(this.complaintId).subscribe({
      next: (data) => {
        this.complaint = data;
        this.statusForm.patchValue({ status: data.status });
        if (data.adminResponse) {
          this.responseForm.patchValue({ adminResponse: data.adminResponse });
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails de la réclamation: ' + err.message;
        this.loading = false;
      }
    });
  }

  updateStatus(): void {
    if (this.statusForm.invalid) return;

    const status = this.statusForm.value.status;
    this.loading = true;

    this.complaintService.updateStatus(this.complaintId, status).subscribe({
      next: (data) => {
        this.complaint = data;
        this.success = `Statut mis à jour avec succès: ${status}`;
        this.loading = false;

        // Effacer le message de succès après 3 secondes
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du statut: ' + err.message;
        this.loading = false;
      }
    });
  }

  submitAdminResponse(): void {
    if (this.responseForm.invalid) return;

    const adminResponse = this.responseForm.value.adminResponse;
    this.submittingResponse = true;

    this.complaintService.addAdminResponse(this.complaintId, adminResponse).subscribe({
      next: (data) => {
        this.complaint = data;
        this.success = 'Réponse ajoutée avec succès';
        this.submittingResponse = false;

        // Effacer le message de succès après 3 secondes
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'ajout de la réponse: ' + err.message;
        this.submittingResponse = false;
      }
    });
  }

  markAsResolved(): void {
    this.loading = true;

    this.complaintService.markAsResolved(this.complaintId).subscribe({
      next: (data) => {
        this.complaint = data;
        this.success = 'Réclamation marquée comme résolue';
        this.loading = false;

        // Mettre à jour le formulaire de statut
        this.statusForm.patchValue({ status: data.status });

        // Effacer le message de succès après 3 secondes
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Erreur lors de la résolution de la réclamation: ' + err.message;
        this.loading = false;
      }
    });
  }

  deleteComplaint(): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réclamation? Cette action est irréversible.')) {
      return;
    }

    this.loading = true;

    this.complaintService.deleteComplaint(this.complaintId).subscribe({
      next: () => {
        this.success = 'Réclamation supprimée avec succès';
        this.loading = false;

        // Rediriger vers la liste des réclamations après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/reclamations']);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Erreur lors de la suppression de la réclamation: ' + err.message;
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case ComplaintStatus.PENDING:
        return 'status-pending';
      case ComplaintStatus.IN_PROGRESS:
        return 'status-in-progress';
      case ComplaintStatus.RESOLVED:
        return 'status-resolved';
      case ComplaintStatus.REJECTED:
        return 'status-rejected';
      default:
        return '';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
