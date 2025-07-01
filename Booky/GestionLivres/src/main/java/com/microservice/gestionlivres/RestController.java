package com.microservice.gestionlivres;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservice.gestionlivres.Entites.Books;
import com.microservice.gestionlivres.Services.Services;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@org.springframework.web.bind.annotation.RestController
@CrossOrigin(origins = "*")
public class RestController {
    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    private Services services;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Le fichier est vide");
            }

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                try {
                    Files.createDirectories(uploadPath);
                } catch (IOException e) {
                    return ResponseEntity.status(500)
                            .body("Impossible de créer le répertoire uploads");
                }
            }

            String filename = System.currentTimeMillis() + "_" +
                    file.getOriginalFilename().replace(" ", "_");
            Path filePath = uploadPath.resolve(filename);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(filename);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Erreur lors de l'upload: " + e.getMessage());
        }
    }

    @PostMapping("/AjoutLivre")
    public ResponseEntity<?> ajouterBook(@Valid @RequestBody Books book) {
        try {
            Books savedBook = services.ajouterBook(book);
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/ShowAllLivre")
    public ResponseEntity< List<Books>> showLivres( @RequestParam(required = false) Boolean sort,
        @RequestParam(required = false, defaultValue = "true") boolean ascending) {

            List<Books> livres;

            if (sort != null && sort) {
                livres = services.getAllBooksSortedByTitle(ascending);
            } else {
                livres = services.showLivres();
            }

            return ResponseEntity.ok(livres);
        }


    @DeleteMapping("/deleteLivre/{id}")
    public String deleteBook(@PathVariable int id) {
        return services.deleteBook(id);
    }


    @PutMapping(value = "/UpdateLivre/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateBook(
            @PathVariable int id,
            @Valid @RequestPart("book") String bookJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        Map<String, Object> response = new HashMap<>();

        try {
            Books bookUpdates = objectMapper.readValue(bookJson, Books.class);
            String result = services.modifierBook(id, bookUpdates, file);
            Books updatedBook = services.getBookById(id).orElseThrow();

            response.put("message", result);
            response.put("status", "success");
            response.put("book", updatedBook);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            response.put("status", "error");
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/getbookbyid/{id}")
    public Optional<Books> getBookById(@PathVariable int id) {
        return services.getBookById(id);
    }

    @PostMapping("/applyPromotion/{id}")
    public ResponseEntity<?> applyPromotion(@PathVariable Long id, @RequestParam Integer promotionPercent) {
        Books updatedBook = services.applyPromotion(id, promotionPercent);
        if (updatedBook != null) {
            return ResponseEntity.ok(updatedBook);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/LivrePdf")
    public ResponseEntity<byte[]> exportBooksToPdf() {
        try {
            List<Books> books = services.showLivres();
            byte[] pdfBytes = services.exportBooksToPdf(books);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "liste_livres.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("books/{id}")
    Books getById(@PathVariable Long id){
        return services.getById(id);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }





    }