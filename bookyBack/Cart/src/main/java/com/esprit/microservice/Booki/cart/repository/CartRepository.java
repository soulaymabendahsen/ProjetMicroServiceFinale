package com.esprit.microservice.Booki.cart.repository;

import com.esprit.microservice.Booki.cart.entity.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {



    Page<Cart> findAll(Pageable pageable);

    Optional<Cart> findByBookId(Long bookId);

    // Search by book title (case-insensitive)
    List<Cart> findByBookTitleContainingIgnoreCase(String title);

    // Get today's carts
 //   @Query("SELECT c FROM Cart c WHERE DATE(c.createdAt) = CURRENT_DATE")
   // List<Cart> findTodayCarts();

    @Query("SELECT c FROM Cart c WHERE c.createdAt >= :startDate")
    List<Cart> findCartsFromLastWeek(@Param("startDate") LocalDateTime startDate);

    // Group by book title for pie chart
    @Query("SELECT c.bookTitle, SUM(c.quantity) FROM Cart c GROUP BY c.bookTitle")
    List<Object[]> countBooksByTitle();


    List<Cart> findAllByOrderByTotalPriceAsc();
    List<Cart> findAllByOrderByTotalPriceDesc();


    Optional<Cart> findByUserIdAndBookId(Long userId, Long bookId);

    List<Cart> findByUserId(Long userId); // Add this method

}


