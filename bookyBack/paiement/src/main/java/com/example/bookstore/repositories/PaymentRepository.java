package com.example.bookstore.repositories;

import com.example.bookstore.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findByStripeSessionId(String sessionId);
    //@Query("SELECT p FROM Payment p WHERE p.cartId = :cartId ORDER BY p.paymentDate DESC")
    //Payment findLatestPaymentByCartId(@Param("cartId") Long cartId);
    Optional<Payment> findTopByOrderByPaymentDateDesc();

    List<Payment> findByBookTitleContainingIgnoreCase(String bookTitle);


    List<Payment> findAllByOrderByBookTitleAsc();
    List<Payment> findAllByOrderByBookTitleDesc();



}
