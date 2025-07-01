package com.example.bookstore.controllers;

import com.example.bookstore.entities.Payment;
import com.example.bookstore.entities.PaymentStatus;
import com.example.bookstore.services.IPaymentService;
import com.example.bookstore.services.PdfGeneratorService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.stripe.model.checkout.Session;
import com.stripe.exception.StripeException;
import com.stripe.Stripe;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private IPaymentService iPaymentService;
    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    @PostMapping("/create-session")
    public Map<String, String> createCheckoutSession(@RequestParam Long cartId,@RequestParam Long userId) throws StripeException {
        String sessionUrl = iPaymentService.createCheckoutSession(cartId, userId);
        return Map.of("url", sessionUrl);
    }

    @PostMapping("/retry")
    public ResponseEntity<Map<String, String>> retryPayment(@RequestBody Map<String, String> request) {
        Long paymentId = Long.parseLong(request.get("paymentId"));

        try {
            // Appeler la méthode retryPayment du service
            String sessionUrl = iPaymentService.retryPayment(paymentId);
            return ResponseEntity.ok(Map.of("checkoutUrl", sessionUrl));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/success")
    public String paymentSuccess(@RequestParam String sessionId) throws MessagingException, UnsupportedEncodingException {
        iPaymentService.updatePaymentStatus(sessionId, PaymentStatus.SUCCEEDED);
        return "Le paiement a été effectué avec succès !";
    }

    @GetMapping("/cancel")
    public String paymentCancel(@RequestParam String sessionId) throws MessagingException, UnsupportedEncodingException {
        iPaymentService.updatePaymentStatus(sessionId, PaymentStatus.CANCELED);
        return "Le paiement a été annulé.";
    }

    @DeleteMapping("/{paymentId}")
    public void deletePayment(@PathVariable Long paymentId) {
        iPaymentService.deletePayment(paymentId);
    }

    @GetMapping("/payment-status")
    public PaymentStatus checkPaymentStatus(@RequestParam String sessionId) throws StripeException, MessagingException, UnsupportedEncodingException {
        return iPaymentService.checkAndUpdatePaymentStatus(sessionId);
    }



    @GetMapping
    public List<Payment> getAllPayments() {
        return iPaymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return iPaymentService.getPaymentById(id);
    }


    @GetMapping("/{paymentId}/invoice")
    public ResponseEntity<byte[]> generateInvoice(@PathVariable Long paymentId) throws IOException {
        Payment payment = iPaymentService.getPaymentById(paymentId);
        byte[] pdfBytes = pdfGeneratorService.generatePaymentInvoice(payment);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("facture-paiement-" + paymentId + ".pdf").build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }


    @GetMapping("/search")
    public List<Payment> searchPaymentsByBookTitle(@RequestParam String bookTitle) {
        return iPaymentService.findByBookTitleContaining(bookTitle);
    }


    @GetMapping("/sorted")
    public List<Payment> getPaymentsSortedByBookTitle(
            @RequestParam(defaultValue = "asc") String sortOrder) {
        return iPaymentService.findAllSortedByBookTitle(sortOrder);
    }
}
