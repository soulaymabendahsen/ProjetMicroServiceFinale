package com.microservice.gestionlivres.Services;

import com.itextpdf.text.DocumentException;
import com.microservice.gestionlivres.Entites.Books;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface Iservices {
   public Books ajouterBook(Books book);
   public List<Books> showLivres();
   public String deleteBook(int id);
   String modifierBook(int id, Books updatedBook, MultipartFile file);
   public Optional<Books> getBookById(int id);
   byte[] exportBooksToPdf(List<Books> books) throws DocumentException;
   public List<Books> getAllBooksSortedByTitle(boolean ascending) ;
   public Books getById(Long id);


}
