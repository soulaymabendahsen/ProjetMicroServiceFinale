package com.microservice.gestionlivres.Entites;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Date;

@Entity
public class Books {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 2, max = 100, message = "Le titre doit contenir entre 2 et 100 caractères")
    private String title;

    @NotBlank(message = "L'auteur est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom de l'auteur doit contenir entre 2 et 100 caractères")
    private String author;

    @Size(max = 2000, message = "Le résumé ne doit pas dépasser 2000 caractères")
    private String Resume;

    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    @DecimalMin(value = "0.01", message = "Le prix minimum est de 0.01")
    private Double price;

    @NotNull(message = "La disponibilité doit être spécifiée")
    private Boolean available;

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 0, message = "La quantité ne peut pas être négative")
    private Integer quantite;

    private String imageUrl;

    // Nouveaux champs pour la promotion
    private Boolean onSale = false;
    
    @Min(value = 0, message = "Le pourcentage de promotion ne peut pas être négatif")
    @Max(value = 100, message = "Le pourcentage de promotion ne peut pas dépasser 100")
    private Integer promotionPercent = 0;

    @Positive(message = "Le prix original doit être positif")
    private Double originalPrice;

    @NotNull(message = "Le genre est obligatoire")
    @Enumerated(EnumType.STRING)
    private Genre genre;

    @NotNull(message = "La langue est obligatoire")
    @Enumerated(EnumType.STRING)
    private Language language;

    @NotNull(message = "La date de publication est obligatoire")
    @Past(message = "La date de publication doit être dans le passé")
    @Temporal(TemporalType.DATE)
    private Date publicationDate;

    // Constructeurs
    public Books() {}

    public Books(String title, String author, String Resume, Double price, Boolean available,
                 Integer quantite, Genre genre, Language language, Date publicationDate, String imageUrl) {
        this.title = title;
        this.author = author;
        this.Resume = Resume;
        this.price = price;
        this.originalPrice = price; // Initialiser le prix original
        this.available = available;
        this.quantite = quantite;
        this.genre = genre;
        this.language = language;
        this.publicationDate = publicationDate;
        this.imageUrl = imageUrl;
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) {
        this.price = price;
        if (this.originalPrice == null) {
            this.originalPrice = price;
        }
    }

    public String getResume() { return Resume; }
    public void setResume(String resume) { Resume = resume; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    // Nouveaux getters/setters pour la promotion
    public Boolean getOnSale() { return onSale; }
    public void setOnSale(Boolean onSale) { this.onSale = onSale; }

    public Integer getPromotionPercent() { return promotionPercent; }
    public void setPromotionPercent(Integer promotionPercent) {
        this.promotionPercent = promotionPercent;
        if (promotionPercent > 0 && this.originalPrice != null) {
            this.price = this.originalPrice * (1 - promotionPercent/100.0);
        }
    }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public Genre getGenre() { return genre; }
    public void setGenre(Genre genre) { this.genre = genre; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public Date getPublicationDate() { return publicationDate; }
    public void setPublicationDate(Date publicationDate) { this.publicationDate = publicationDate; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    @Override
    public String toString() {
        return "Books{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", Resume='" + Resume + '\'' +
                ", price=" + price +
                ", available=" + available +
                ", quantite=" + quantite +
                ", imageUrl='" + imageUrl + '\'' +
                ", genre=" + genre +
                ", language=" + language +
                ", publicationDate=" + publicationDate +
                '}';
    }
}