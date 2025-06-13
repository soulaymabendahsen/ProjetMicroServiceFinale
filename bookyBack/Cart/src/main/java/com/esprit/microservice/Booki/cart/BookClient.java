package com.esprit.microservice.Booki.cart;

import com.esprit.microservice.Booki.cart.config.FeignConfig;
import com.esprit.microservice.Booki.cart.dto.Books;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@FeignClient(name = "GESTIONLIVRES" )
public  interface BookClient {

    @GetMapping("/ShowAllLivre")
     List<Books> getAllBooks();


    @GetMapping("books/{id}")
    Books getById(@PathVariable Long id);


    @PutMapping(value = "/UpdateLivre/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Map<String, Object>> updateBook(
            @PathVariable int id,
            @RequestPart("book") String bookJson,
            @RequestPart(value = "file", required = false) MultipartFile file);
}