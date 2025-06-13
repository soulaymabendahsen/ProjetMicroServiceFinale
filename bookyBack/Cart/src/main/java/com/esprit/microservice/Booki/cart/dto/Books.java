package com.esprit.microservice.Booki.cart.dto;


import lombok.Data;

@Data
public class Books {
    private Long id;  // Changed from int to Long to match your Feign client
    private String title;
    private String author;
    private Double price;
    private Boolean available;
    private Integer quantite;  // Nouvel attribut ajouté
    private String imageUrl;

}