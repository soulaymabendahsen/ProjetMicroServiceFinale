package com.esprit.microservice.Booki.cart.service;


import com.esprit.microservice.Booki.cart.BookClient;
import com.esprit.microservice.Booki.cart.UserServiceClient;
import com.esprit.microservice.Booki.cart.dto.Books;
import com.esprit.microservice.Booki.cart.entity.Cart;
import com.esprit.microservice.Booki.cart.repository.CartRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.knowm.xchart.BitmapEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.io.ByteArrayOutputStream;

import org.knowm.xchart.PieChart;
import org.knowm.xchart.PieChartBuilder;
import org.knowm.xchart.style.Styler;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookClient bookClient;

    @Autowired
    private ObjectMapper objectMapper; // Add Jackson ObjectMapper

    @Autowired
    private UserServiceClient userServiceClient;

    @Transactional
    public Cart addToCart(Long bookId, Integer quantity) {
        // 1. Validate and extract user ID from JWT token
        Long userId = validateAndExtractUserId();
        System.out.println("Extracted userId: " + userId); // Debug


        // 2. Validate input parameters
        validateInputParameters(quantity);

        // 3. Fetch book details from Book service
        Books book = fetchBookDetails(bookId);

        // 4. Check if book already exists in user's cart
        checkExistingCartItem(userId, bookId, book);

        // 5. Validate stock availability
        validateStockAvailability(book, quantity);

        // 6. Create new cart item
        Cart cartItem = createCartItem(userId, bookId, quantity, book);

        // 7. Update book stock in Book service
        updateBookStock(book, quantity);

        // 8. Save and return cart item
        return cartRepository.save(cartItem);
    }

    private Long validateAndExtractUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            String username = jwt.getSubject(); // Get username from 'sub' claim

            if (username == null) {
                throw new RuntimeException("JWT token does not contain a 'sub' claim");
            }

            // Fetch user ID from User Service
            Long userId = userServiceClient.getUserIdByUsername(username);
            System.out.println("Extracted username from JWT: " + username);

            if (userId == null) {
                throw new RuntimeException("User ID not found for username: " + username);
            }

            return userId;
        }
        throw new RuntimeException("No authenticated user found");
    }


    private void validateInputParameters(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive number");
        }
    }

    private Books fetchBookDetails(Long bookId) {
        Books book = bookClient.getById(bookId);
        if (book == null) {
            throw new RuntimeException("Book not found with ID: " + bookId);
        }
        return book;
    }

    private void checkExistingCartItem(Long userId, Long bookId, Books book) {
        cartRepository.findByUserIdAndBookId(userId, bookId).ifPresent(item -> {
            throw new RuntimeException(
                    String.format("Book '%s' is already in your cart", book.getTitle())
            );
        });
    }

    private void validateStockAvailability(Books book, Integer quantity) {
        if (book.getQuantite() == null || book.getQuantite() < quantity) {
            throw new RuntimeException(
                    String.format("Insufficient stock for '%s'. Requested: %d, Available: %d",
                            book.getTitle(), quantity,
                            book.getQuantite() != null ? book.getQuantite() : 0)
            );
        }
    }

    private Cart createCartItem(Long userId, Long bookId, Integer quantity, Books book) {
        Cart cartItem = new Cart();
        cartItem.setUserId(userId);
        cartItem.setBookId(bookId);
        cartItem.setBookTitle(book.getTitle());
        cartItem.setBookPrice(book.getPrice());
        cartItem.setImageUrl(book.getImageUrl());
        cartItem.setQuantity(quantity);
        cartItem.setTotalPrice(book.getPrice() * quantity);
        return cartItem;
    }

    private void updateBookStock(Books book, Integer quantity) {
        try {
            Books stockUpdate = new Books();
            stockUpdate.setId(book.getId());
            stockUpdate.setTitle(book.getTitle());
            stockUpdate.setAuthor(book.getAuthor());
            stockUpdate.setPrice(book.getPrice());
            stockUpdate.setQuantite(book.getQuantite() - quantity);
            stockUpdate.setImageUrl(book.getImageUrl());
            stockUpdate.setAvailable(book.getQuantite() - quantity > 0);

            String bookJson = objectMapper.writeValueAsString(stockUpdate);

            ResponseEntity<Map<String, Object>> response = bookClient.updateBook(
                    Math.toIntExact(book.getId()),
                    bookJson,
                    null
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to update book stock: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update book stock: " + e.getMessage());
        }
    }




    @Transactional
    public void removeFromCart(Long cartId) {
        Cart cartItem = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        try {
            // Restore the stock quantity
            Books book = bookClient.getById(cartItem.getBookId());

            Books stockUpdate = new Books();
            stockUpdate.setId(book.getId());
            stockUpdate.setTitle(book.getTitle());
            stockUpdate.setAuthor(book.getAuthor());
            stockUpdate.setPrice(book.getPrice());
            stockUpdate.setQuantite(book.getQuantite() + cartItem.getQuantity());
            stockUpdate.setImageUrl(book.getImageUrl());
            // Include all other necessary fields

            String bookJson = objectMapper.writeValueAsString(stockUpdate);

            ResponseEntity<Map<String, Object>> response = bookClient.updateBook(
                    Math.toIntExact(cartItem.getBookId()),
                    bookJson,
                    null
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to restore book stock: " + response.getBody());
            }

            // Delete cart item
            cartRepository.delete(cartItem);
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove cart item: " + e.getMessage());
        }
    }


    @Transactional
    public Cart updateCartItemQuantity(Long cartId, Integer newQuantity) {
        if (newQuantity == null || newQuantity < 0) {
            throw new IllegalArgumentException("Quantity must be a positive number");
        }

        Cart cartItem = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Books book = bookClient.getById(cartItem.getBookId());

        // Calculate the stock difference
        int quantityDifference = newQuantity - cartItem.getQuantity();
        int newStockQuantity = book.getQuantite() - quantityDifference;

        // Validate new stock quantity
        if (newStockQuantity < 0) {
            throw new RuntimeException(
                    String.format("Insufficient stock for '%s'. Available: %d, Requested change: %d",
                            book.getTitle(), book.getQuantite(), quantityDifference)
            );
        }

        try {
            // Update book stock
            Books stockUpdate = new Books();
            stockUpdate.setId(book.getId());
            stockUpdate.setTitle(book.getTitle());
            stockUpdate.setAuthor(book.getAuthor());
            stockUpdate.setPrice(book.getPrice());
            stockUpdate.setQuantite(newStockQuantity);
            stockUpdate.setImageUrl(book.getImageUrl());
            // Set available to false if new stock quantity is 0
            stockUpdate.setAvailable(newStockQuantity > 0);
            // Include all other necessary fields

            String bookJson = objectMapper.writeValueAsString(stockUpdate);

            ResponseEntity<Map<String, Object>> response = bookClient.updateBook(
                    Math.toIntExact(cartItem.getBookId()),
                    bookJson,
                    null
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to update book stock: " + response.getBody());
            }

            // Update cart item
            if (newQuantity == 0) {
                cartRepository.delete(cartItem);
                return null;
            } else {
                cartItem.setQuantity(newQuantity);
                cartItem.setTotalPrice(book.getPrice() * newQuantity);
                return cartRepository.save(cartItem);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update cart quantity: " + e.getMessage());
        }
    }



    public List<Cart> getCartContents() {
        return cartRepository.findAll();
    }



    public Double calculateCartTotal() {
        return cartRepository.findAll().stream()
                .mapToDouble(Cart::getTotalPrice)
                .sum();
    }


    @Transactional
    public void clearCart() {
        cartRepository.deleteAll();
    }


    public int cartCount() {
        return cartRepository.findAll().size();
    }


    public ResponseEntity<?> searchByTitle(String title) {
        List<Cart> foundCarts = cartRepository.findByBookTitleContainingIgnoreCase(title);

        if (foundCarts.isEmpty()) {
            String errorMessage = String.format("No books containing '%s' were found in the cart", title);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
        }

        return ResponseEntity.ok(foundCarts);
    }



    public List<Cart> getAllCartsSortedByPrice(boolean ascending) {
        return ascending ?
                cartRepository.findAllByOrderByTotalPriceAsc() :
                cartRepository.findAllByOrderByTotalPriceDesc();
    }


  //  public List<Cart> getTodayCarts() {
    //    return cartRepository.findTodayCarts();
  //  }

    public List<Cart> getCartsFromLastWeek() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7); // Last 7 days
        return cartRepository.findCartsFromLastWeek(startDate);
    }


    public byte[] generateCartQRCode(Long cartId) throws Exception {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        String cartData = String.format(
                "Cart ID: %d \n Book: %s \nQuantity: %d \nTotal: $%.2f",
                cart.getId(), cart.getBookTitle(), cart.getQuantity(), cart.getTotalPrice()
        );

        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(cartData, BarcodeFormat.QR_CODE, 200, 200);

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", os);
        return os.toByteArray(); // Return raw bytes
    }


    public byte[] generateBookPopularityChart() {
        List<Object[]> data = cartRepository.countBooksByTitle();
        Map<String, Integer> bookCounts = data.stream()
                .collect(Collectors.toMap(
                        arr -> (String) arr[0],
                        arr -> ((Long) arr[1]).intValue()
                ));

        PieChart chart = new PieChartBuilder()
                .width(800)
                .height(600)
                .title("Book Popularity in Carts")
                .theme(Styler.ChartTheme.GGPlot2)
                .build();

        bookCounts.forEach(chart::addSeries);

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        try {
            BitmapEncoder.saveBitmap(chart, os, BitmapEncoder.BitmapFormat.PNG);
            return os.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate chart", e);
        }
    }


}