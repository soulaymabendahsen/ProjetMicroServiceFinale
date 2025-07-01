import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snack-bar',
  template: `
    <div class="custom-snackbar" [ngClass]="data.type">
      <span class="icon">{{ data.icon }}</span>
      <span class="message">{{ data.message }}</span>
      <button (click)="dismiss()">✕</button>
    </div>
  `,
  styles: [`
    .custom-snackbar {
      display: flex;
      align-items: center;
      padding: 14px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .success {
      background: #4CAF50;
    }
    .error {
      background: #F44336;
    }
    .icon {
      margin-right: 12px;
      font-weight: bold;
    }
    .message {
      flex: 1;
    }
    button {
      margin-left: 24px;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
    }
  `]
})
export class CustomSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  dismiss() {
    this.data.snackBar.dismiss();
  }
}