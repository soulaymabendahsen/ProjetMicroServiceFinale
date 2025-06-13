package com.microservice.gestionlivres.Repositories;

import com.microservice.gestionlivres.Entites.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Book;
import java.util.List;

@Repository
public interface LivreRepo extends JpaRepository<Books, Integer> {
    List<Books> findAllByOrderByTitleAsc();
    List<Books> findAllByOrderByTitleDesc();
    Books findById(Long id);
}
