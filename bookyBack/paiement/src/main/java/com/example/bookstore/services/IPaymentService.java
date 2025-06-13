package com.example.bookstore.services;

import com.example.bookstore.entities.Payment;
import com.example.bookstore.entities.PaymentStatus;
import com.stripe.exception.StripeException;
import jakarta.mail.MessagingException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

public interface IPaymentService {
    String createCheckoutSession(Long cartId, Long userId) throws StripeException;
    void updatePaymentStatus(String sessionId, PaymentStatus status) throws MessagingException, UnsupportedEncodingException;
    public String retryPayment(Long paymentId) throws StripeException;
    List<Payment> getAllPayments();
    Payment getPaymentById(Long id);
    public PaymentStatus checkAndUpdatePaymentStatus(String sessionId) throws StripeException, MessagingException, UnsupportedEncodingException  ;
    public void deletePayment(Long id) ;

    List<Payment> findByBookTitleContaining(String bookTitle);


    public List<Payment> findAllSortedByBookTitle(String sortOrder);



    }
