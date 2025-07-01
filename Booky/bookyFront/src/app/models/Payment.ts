// payment.model.ts
import { PaymentStatus } from './payment-status.enum';

export interface Payment {
    id: number;
    cartId: number;
    bookId: number;
    bookTitle: string;
    bookImageUrl: string;
    quantity: number;
    bookPrice: number;
    stripeSessionId: string;
    paymentMethod: string;
    paymentStatus: PaymentStatus; // Utilisez l'enum ici
    paymentDate: Date;
    amount: number;
    customerEmail: string;
}