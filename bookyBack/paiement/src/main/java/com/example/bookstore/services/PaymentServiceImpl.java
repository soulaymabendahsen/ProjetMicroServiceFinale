package com.example.bookstore.services;

import com.example.bookstore.UserServiceClient;
import com.example.bookstore.client.CartServiceClient;
import com.example.bookstore.dto.CartCheckoutDTO;
import com.example.bookstore.dto.UserDTO;
import com.example.bookstore.entities.Payment;
import com.example.bookstore.entities.PaymentMethods;
import com.example.bookstore.entities.PaymentStatus;
import com.example.bookstore.repositories.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.TemplateEngine;


import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentServiceImpl implements IPaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CartServiceClient cartServiceClient;

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Override
    public String createCheckoutSession(Long cartId,Long userId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        CartCheckoutDTO cart = cartServiceClient.getCartById(cartId);
        UserDTO user = userServiceClient.getUserById(userId);


        // Configuration des articles du panier
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        lineItems.add(
                SessionCreateParams.LineItem.builder()
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("eur")
                                        .setUnitAmount((long) (cart.getTotalPrice() * 100)) // Montant en centimes
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName("Commande - Order & Payment Service")
                                                        .build()
                                        )
                                        .build()
                        )
                        .setQuantity(1L)
                        .build()
        );

        // Création de la session de paiement Stripe
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                //.setSuccessUrl("http://localhost:4200/payment-success?sessionId={CHECKOUT_SESSION_ID}&status=success")
                //.setCancelUrl("http://localhost:4200/payment-success?sessionId={CHECKOUT_SESSION_ID}&status=failed")
                .setSuccessUrl("http://localhost:8085/payment/success?sessionId={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:8085/payment/cancel?sessionId={CHECKOUT_SESSION_ID}")
                .addAllLineItem(lineItems)
                .setCustomerEmail(user.getEmail()) // Ajout de l'email du client dans Stripe
                .build();

        Session session = Session.create(params);

        // Enregistrer les détails de paiement dans la base de données
        Payment payment = new Payment();
        payment.setCartId(cartId);
        payment.setUserId(cart.getUserId());
        payment.setUsername(user.getUsername());
        payment.setBookId(cart.getBookId());
        payment.setAmount(cart.getTotalPrice());
        payment.setBookTitle(cart.getBookTitle());
        payment.setBookImageUrl(cart.getImageUrl());
        payment.setQuantity(cart.getQuantity());
        payment.setBookPrice(cart.getBookPrice());
        payment.setPaymentMethod(PaymentMethods.STRIPE);
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setStripeSessionId(session.getId());
        payment.setPaymentDate(LocalDateTime.now()); // Date actuelle
        payment.setCustomerEmail(user.getEmail()); // Email du client
        paymentRepository.save(payment);

        return session.getUrl();
    }

    @Override
    public String retryPayment(Long paymentId) throws StripeException {
        // Récupérer les détails du paiement à partir de la base de données
        Payment existingPayment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Paiement non trouvé"));

        // Si le paiement a échoué ou est en attente, réessayer
        if (existingPayment.getPaymentStatus() == PaymentStatus.FAILED || existingPayment.getPaymentStatus() == PaymentStatus.PENDING) {
            // Extraire les informations nécessaires
            Long cartId = existingPayment.getCartId();
            //String customerEmail = existingPayment.getCustomerEmail();

            // Créer une nouvelle session de paiement
            String sessionUrl = createCheckoutSession(cartId, existingPayment.getUserId());

            // Mettre à jour le paiement existant avec le nouveau Stripe Session ID
            Payment latestPayment = paymentRepository.findTopByOrderByPaymentDateDesc().orElse(null);
            existingPayment.setStripeSessionId(latestPayment.getStripeSessionId());
            existingPayment.setPaymentStatus(PaymentStatus.PENDING); // Réinitialiser à PENDING
            existingPayment.setPaymentDate(LocalDateTime.now());
            paymentRepository.save(existingPayment); // Sauvegarder la mise à jour
            paymentRepository.delete(latestPayment);

            return sessionUrl; // Retourner l'URL de la session de paiement
        } else {
            throw new IllegalStateException("Le paiement ne peut pas être réessayé car il est déjà validé.");
        }
    }

    @Transactional
    public PaymentStatus checkAndUpdatePaymentStatus(String sessionId) throws StripeException, MessagingException, UnsupportedEncodingException  {
        Payment payment = paymentRepository.findByStripeSessionId(sessionId);

        if (payment == null) {
            return PaymentStatus.PENDING; // Retourner un statut par défaut si non trouvé
        }

        // Si le paiement est déjà réussi ou échoué, ne pas interroger Stripe
        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            return payment.getPaymentStatus();
        }

        // Récupérer l'état du paiement depuis Stripe
        Session session = Session.retrieve(sessionId);
        String stripeStatus = session.getStatus();

        if ("complete".equals(stripeStatus)) {
            payment.setPaymentStatus(PaymentStatus.SUCCEEDED);
            sendPaymentSuccessEmail(payment);
        } else if ("expired".equals(stripeStatus)) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
        }

        // Enregistrer les modifications si le statut a changé
        paymentRepository.save(payment);
        return payment.getPaymentStatus();
    }


    private void sendPaymentSuccessEmail(Payment payment) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Préparation des données dynamiques
        Context context = new Context();
        context.setVariable("bookTitle", payment.getBookTitle());
        context.setVariable("amount", payment.getAmount());
        context.setVariable("paymentDate", payment.getPaymentDate()); // Envoyez directement l'objet LocalDateTime
        context.setVariable("paymentId", payment.getId());
        context.setVariable("orderLink", "http://localhost:4200/home");

        // Génération du HTML
        String htmlContent = templateEngine.process("email-template", context);

        // Configuration et envoi de l'email
        helper.setTo(payment.getCustomerEmail());
        helper.setSubject("Confirmation de paiement - BookStore");
        helper.setText(htmlContent, true);
        helper.setFrom("no-reply@bookstore.com", "Équipe BookStore");
        // Envoi
        mailSender.send(message);
    }



    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Override
    public void updatePaymentStatus(String sessionId, PaymentStatus status) throws MessagingException, UnsupportedEncodingException {
        // Récupérer le paiement associé à la session Stripe
        Payment payment = paymentRepository.findByStripeSessionId(sessionId);
        if (payment != null) {
            payment.setPaymentStatus(status);
            if(payment.getPaymentStatus() == PaymentStatus.SUCCEEDED) {
                sendPaymentSuccessEmail(payment);
                System.out.println("*****************************************************************************************");
                System.out.println("email envoyé!");
                System.out.println("*****************************************************************************************");
            }
            System.out.println("*****************************************************************************************");
            System.out.println("email non envoyé!");
            System.out.println("*****************************************************************************************");
            paymentRepository.save(payment);
        }
    }

    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new EntityNotFoundException("Paiement introuvable !");
        }
        paymentRepository.deleteById(id);
    }

    @Override
    public List<Payment> findByBookTitleContaining(String bookTitle) {
        return paymentRepository.findByBookTitleContainingIgnoreCase(bookTitle);
    }


    @Override
    public List<Payment> findAllSortedByBookTitle(String sortOrder) {
        if ("desc".equalsIgnoreCase(sortOrder)) {
            return paymentRepository.findAllByOrderByBookTitleDesc();
        } else {
            return paymentRepository.findAllByOrderByBookTitleAsc();
        }
    }


}