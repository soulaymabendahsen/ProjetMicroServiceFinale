import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/Payment';
import { PaymentService } from 'src/app/services/payment.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-back',
  templateUrl: './payment-back.component.html',
  styleUrls: ['./payment-back.component.css'],
})
export class PaymentBackComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  searchTerm: string = '';
  isLoading = true;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.filteredPayments = [...this.payments];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching payments:', error);
        this.isLoading = false;
      },
    });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredPayments = [...this.payments];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredPayments = this.payments.filter(
        (payment) =>
          payment.bookTitle.toLowerCase().includes(term) ||
          payment.customerEmail.toLowerCase().includes(term)
      );
    }

    if (this.sortColumn) {
      this.sortData(this.sortColumn);
    }
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredPayments.sort((a, b) => {
      let comparison = 0;
      switch (column) {
        case 'book':
          comparison = a.bookTitle.localeCompare(b.bookTitle);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'method':
          comparison = a.paymentMethod.localeCompare(b.paymentMethod);
          break;
        case 'status':
          comparison = a.paymentStatus.localeCompare(b.paymentStatus);
          break;
        case 'date':
          comparison =
            new Date(a.paymentDate).getTime() -
            new Date(b.paymentDate).getTime();
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  formatDate(dateString: Date): string {
    const paymentDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - paymentDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "À l'instant";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24 && paymentDate.getDate() === now.getDate()) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      paymentDate.getDate() === yesterday.getDate() &&
      paymentDate.getMonth() === yesterday.getMonth() &&
      paymentDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Hier';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(paymentDate);
  }

  getImageUrl(path: string): string {
    return 'assets/images/cart-item1.jpg';

    // You can replace the above with the following if using uploaded image paths:
    // return path && !path.startsWith('http')
    //   ? `${environment.gatewayUrl}/uploads/${path}`
    //   : path || 'assets/images/cart-item1.jpg';
  }

  downloadPaymentPDF(paymentId: number): void {
    this.paymentService.downloadPaymentPDF(paymentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-paiement-${paymentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
      },
    });
  }

  truncateString(text: string, maxLength: number = 10): string {
    return !text
      ? ''
      : text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPayments.length / this.itemsPerPage);
  }

  get paginatedPayments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPayments.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(direction: number) {
    this.currentPage = Math.max(
      1,
      Math.min(this.currentPage + direction, this.totalPages)
    );
  }

  retryPayment(paymentId: number) {
    if (!confirm('Voulez-vous vraiment relancer ce paiement ?')) return;

    this.paymentService.retryPayment(paymentId).subscribe({
      next: (response) => {
        if (response?.checkoutUrl) {
          window.location.href = response.checkoutUrl;
        } else {
          alert('Impossible de relancer le paiement.');
        }
      },
      error: (error) => {
        console.error('Erreur relance paiement:', error);
        alert('Erreur lors de la relance du paiement.');
      },
    });
  }

  deletePayment(paymentId: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) return;

    this.paymentService.deletePayment(paymentId).subscribe({
      next: () => {
        this.payments = this.payments.filter((p) => p.id !== paymentId);
        this.applyFilter();
      },
      error: (error) => {
        console.error('Erreur suppression paiement:', error);
        alert('Erreur lors de la suppression du paiement.');
      },
    });
  }
}
