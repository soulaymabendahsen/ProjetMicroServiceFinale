package com.microservice.gestionlivres.Services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.microservice.gestionlivres.Entites.Books;
import com.microservice.gestionlivres.Repositories.LivreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class Services implements Iservices{
    @Autowired
    LivreRepo livreRepo;
    @Override
    public Books ajouterBook(Books book) {
        return livreRepo.save(book);
    }

    @Override
    public List<Books> showLivres() {
        return livreRepo.findAll();
    }

    @Override
    public String deleteBook(int id) {
        try {
            // Vérifie d'abord si le livre existe
            if (livreRepo.existsById(id)) {
                livreRepo.deleteById(id);
                return "Livre supprimé avec succès (ID: " + id + ")";
            } else {
                return "Échec de la suppression: Aucun livre trouvé avec l'ID " + id;
            }
        } catch (Exception e) {
            // Log l'erreur si nécessaire
            return "Échec de la suppression: Une erreur est survenue lors de la suppression du livre (ID: " + id + ")";
        }
    }
    @Value("${file.upload-dir}")
    private String uploadDir;
    @Override
    public String modifierBook(int id, Books updatedBook, MultipartFile file) {
        try {
            Optional<Books> optionalBook = livreRepo.findById(id);

            if (optionalBook.isPresent()) {
                Books existingBook = optionalBook.get();

                // Mise à jour des champs
                if (updatedBook.getTitle() != null) {
                    existingBook.setTitle(updatedBook.getTitle());
                }
                if (updatedBook.getAuthor() != null) {
                    existingBook.setAuthor(updatedBook.getAuthor());
                }
                if (updatedBook.getPrice() != null) {
                    existingBook.setPrice(updatedBook.getPrice());
                }
                if (updatedBook.getAvailable() != null) {
                    existingBook.setAvailable(updatedBook.getAvailable());
                }
                if (updatedBook.getQuantite()!= null) {
                    existingBook.setQuantite(updatedBook.getQuantite());
                }
                if (updatedBook.getGenre() != null) {
                    existingBook.setGenre(updatedBook.getGenre());
                }
                if (updatedBook.getLanguage() != null) {
                    existingBook.setLanguage(updatedBook.getLanguage());
                }
                if (updatedBook.getResume() != null) {
                    existingBook.setResume(updatedBook.getResume());
                }


                // Gestion de l'image
                if (file != null && !file.isEmpty()) {
                    String filename = storeFile(file);
                    existingBook.setImageUrl("/api/books/uploads/" + filename); // Mettez à jour imageUrl
                }

                livreRepo.save(existingBook);
                return "Livre modifié avec succès (ID: " + id + ")";
            }
            return "Livre introuvable (ID: " + id + ")";
        } catch (Exception e) {
            return "Erreur: " + e.getMessage();
        }
    }

    private String storeFile(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir).resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }


    @Override
    public Optional<Books> getBookById(int id) {
        return livreRepo.findById(id);
    }

    @Override
    public byte[] exportBooksToPdf(List<Books> books) throws DocumentException {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();

            // Titre du document
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Liste des Livres", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(Chunk.NEWLINE);

            // Tableau des livres
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);

            // En-têtes du tableau
            table.addCell("ID");
            table.addCell("Titre");
            table.addCell("Auteur");
            table.addCell("Année");

            // Remplissage des données
            for (Books book : books) {
                table.addCell(book.getId().toString());
                table.addCell(book.getTitle());
                table.addCell(book.getAuthor());
                table.addCell(book.getPublicationDate().toString());
            }

            document.add(table);
            document.close();

            return outputStream.toByteArray();
        }

    @Override
    public List<Books> getAllBooksSortedByTitle(boolean ascending) {
        return ascending ? livreRepo.findAllByOrderByTitleAsc()
                : livreRepo.findAllByOrderByTitleDesc();
    }

    @Override
    public Books getById(Long id)
    {
        return livreRepo.findById(id);

    }

    public Books applyPromotion(Long id, Integer promotionPercent) {
        Books book = livreRepo.findById(id);
        if (book != null) {
            // Sauvegarder le prix original s'il n'existe pas encore
            if (book.getOriginalPrice() == null || book.getOriginalPrice() == 0) {
                book.setOriginalPrice(book.getPrice());
            }

            if (promotionPercent > 0) {
                book.setOnSale(true);
                book.setPromotionPercent(promotionPercent);
                // Calculer le nouveau prix avec la promotion
                double newPrice = book.getOriginalPrice() * (1 - (promotionPercent / 100.0));
                // S'assurer que le prix ne devient pas négatif ou zéro
                book.setPrice(Math.max(0.01, Math.round(newPrice * 100.0) / 100.0));
            } else {
                // Si la promotion est 0%, remettre le prix original
                book.setOnSale(false);
                book.setPromotionPercent(0);
                book.setPrice(book.getOriginalPrice());
            }
            
            // Vérification finale pour s'assurer que le prix n'est pas null
            if (book.getPrice() == null) {
                book.setPrice(book.getOriginalPrice());
            }
            
            return livreRepo.save(book);
        }
        return null;
    }

}
