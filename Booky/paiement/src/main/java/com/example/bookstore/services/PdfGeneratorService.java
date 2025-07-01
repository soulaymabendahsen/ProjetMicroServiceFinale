package com.example.bookstore.services;

import com.example.bookstore.entities.Payment;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Service
public class PdfGeneratorService {

    public byte[] generatePaymentInvoice(Payment payment) throws IOException {
        Objects.requireNonNull(payment, "Payment cannot be null");

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Configuration
                float margin = 50;
                float yPosition = 750;
                float lineSpacing = 20;

                // Polices
                PDType1Font fontBold = PDType1Font.HELVETICA_BOLD;
                PDType1Font fontRegular = PDType1Font.HELVETICA;

                // 1. En-tête
                drawText(contentStream, fontBold, 18, margin, yPosition, "FACTURE");
                yPosition -= 40;

                // 2. Informations de la facture
                drawText(contentStream, fontRegular, 10, margin, yPosition,
                        "N° Facture: " + safeString(payment.getId()));
                yPosition -= lineSpacing;

                // Correction ici: Utilisation directe du LocalDateTime
                drawText(contentStream, fontRegular, 10, margin, yPosition,
                        "Date: " + (payment.getPaymentDate() != null ?
                                payment.getPaymentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : "N/A"));
                yPosition -= lineSpacing;

                drawText(contentStream, fontRegular, 10, margin, yPosition,
                        "Client: " + safeString(payment.getUsername())); // Utilisation du username
                yPosition -= lineSpacing;

                drawText(contentStream, fontRegular, 10, margin, yPosition,
                        "Email: " + safeString(payment.getCustomerEmail())); // Email séparé
                yPosition -= 40;

                drawText(contentStream, fontRegular, 10, margin, yPosition,
                        "Client: " + safeString(payment.getCustomerEmail()));
                yPosition -= 40;

                // 3. Détails du produit
                drawProductDetails(contentStream, margin, yPosition, payment);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private void drawProductDetails(PDPageContentStream contentStream, float margin, float y, Payment payment)
            throws IOException {
        PDType1Font fontBold = PDType1Font.HELVETICA_BOLD;
        PDType1Font fontRegular = PDType1Font.HELVETICA;

        drawText(contentStream, fontBold, 12, margin, y, "DÉTAILS DE LA COMMANDE");
        y -= 30;

        drawLine(contentStream, margin, y, 550, y);
        y -= 20;

        float[] columns = {margin, margin + 250, margin + 400, margin + 480};
        String[] headers = {"Produit", "Prix unitaire", "Quantité", "Total"};

        // En-têtes
        for (int i = 0; i < headers.length; i++) {
            drawText(contentStream, fontBold, 10, columns[i], y, headers[i]);
        }
        y -= 20;

        // Données
        drawText(contentStream, fontRegular, 10, columns[0], y, safeString(payment.getBookTitle()));
        drawText(contentStream, fontRegular, 10, columns[1], y, formatPrice(payment.getBookPrice()));
        drawText(contentStream, fontRegular, 10, columns[2], y, safeString(payment.getQuantity()));
        drawText(contentStream, fontRegular, 10, columns[3], y, formatPrice(payment.getAmount()));
    }

    // Méthodes utilitaires
    private void drawText(PDPageContentStream contentStream, PDType1Font font, float size,
                          float x, float y, String text) throws IOException {
        contentStream.beginText();
        contentStream.setFont(font, size);
        contentStream.newLineAtOffset(x, y);
        contentStream.showText(text != null ? text : "");
        contentStream.endText();
    }

    private void drawLine(PDPageContentStream contentStream, float x1, float y1, float x2, float y2)
            throws IOException {
        contentStream.moveTo(x1, y1);
        contentStream.lineTo(x2, y2);
        contentStream.stroke();
    }

    private String safeString(Object obj) {
        return obj != null ? obj.toString() : "N/A";
    }

    private String formatPrice(Double price) {
        return price != null ? String.format("%.2f TND", price) : "0.00 TND";
    }
}