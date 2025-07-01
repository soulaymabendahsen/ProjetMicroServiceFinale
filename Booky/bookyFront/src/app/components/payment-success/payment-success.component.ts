import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, takeWhile } from 'rxjs';
import { PaymentStatus } from '../../models/payment-status.enum'; // Importez l'enum
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  isSuccess = false;
  isLoading = true;
  sessionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    if (this.sessionId) {
      this.checkPaymentStatus(this.sessionId);
    } else {
      this.isLoading = false;
    }
  }

  checkPaymentStatus(sessionId: string): void {
    this.paymentService.getPaymentStatus(sessionId).subscribe({
      next: (status) => {
        this.isSuccess = status === PaymentStatus.SUCCEEDED;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur lors de la récupération du statut :", error);
        this.isLoading = false;
      }
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  
}