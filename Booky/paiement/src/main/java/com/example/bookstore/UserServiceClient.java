package com.example.bookstore;

import com.example.bookstore.config.FeignConfig;
import com.example.bookstore.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "USER-SERVICE", // ⚠️ Doit correspondre exactement au spring.application.name du service User
        configuration = FeignConfig.class
)
public interface UserServiceClient {

    @GetMapping("/api/users/{userId}")
    UserDTO getUserById(@PathVariable Long userId);

    @GetMapping("/api/users/username/{username}")
    Long getUserIdByUsername(@PathVariable String username);

    @GetMapping("/api/users/username-details/{username}")
    UserDTO getUserDetailsByUsername(@PathVariable String username);
}