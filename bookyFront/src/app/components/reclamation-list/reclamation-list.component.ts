import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint, ComplaintStatus, ComplaintCategory, ComplaintPriority } from '../../models/complaint';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  loading = false;
  error = '';

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;

  // Filtres
  statusFilter: string = '';
  categoryFilter: string = '';
  priorityFilter: string = '';
  searchTerm: string = '';

  // Options pour les filtres
  statuses = Object.values(ComplaintStatus);
  categories = Object.values(ComplaintCategory);
  priorities = Object.values(ComplaintPriority);

  constructor(
    private complaintService: ComplaintService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    this.complaintService.getComplaints(
      this.currentPage,
      this.itemsPerPage,
      this.statusFilter,
      this.categoryFilter,
      this.priorityFilter
    ).subscribe({
      next: (data) => {
        this.complaints = data.complaints;
        this.filteredComplaints = [...this.complaints];
        this.totalPages = data.totalPages;
        this.totalItems = data.totalItems;
        this.loading = false;
        this.applySearchFilter();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des réclamations: ' + err.message;
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1; // Réinitialiser à la première page lors de l'application des filtres
    this.loadComplaints();
  }

  resetFilters(): void {
    this.statusFilter = '';
    this.categoryFilter = '';
    this.priorityFilter = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadComplaints();
  }

  applySearchFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredComplaints = [...this.complaints];
      return;
    }

    const search = this.searchTerm.toLowerCase().trim();
    this.filteredComplaints = this.complaints.filter(complaint =>
      complaint.subject.toLowerCase().includes(search) ||
      complaint.description.toLowerCase().includes(search) ||
      complaint.userEmail.toLowerCase().includes(search) ||
      complaint.userName.toLowerCase().includes(search) ||
      (complaint.bookTitle && complaint.bookTitle.toLowerCase().includes(search))
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadComplaints();
  }

  viewDetails(id: string): void {
    this.router.navigate(['/reclamation-details', id]);
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

  getPriorityClass(priority: string): string {
    switch (priority) {
      case ComplaintPriority.LOW:
        return 'priority-low';
      case ComplaintPriority.MEDIUM:
        return 'priority-medium';
      case ComplaintPriority.HIGH:
        return 'priority-high';
      case ComplaintPriority.URGENT:
        return 'priority-urgent';
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
