package com.example.bookstore.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class CartCheckoutDTO {
    private Long cartId;      // ID du panier (venant de Cart)
    private Long bookId;      // ID du livre (venant de Cart)
    private Long userId;      // ID de l'utilisateur (venant de Cart)
    private Double totalPrice; // Prix total (venant de Cart)
    private String customerEmail; // Email du client (ajouté côté Paiement)
    private String bookTitle;  // Store necessary book info for display
    private Double bookPrice;
    private Integer quantity;
    private String imageUrl;
}