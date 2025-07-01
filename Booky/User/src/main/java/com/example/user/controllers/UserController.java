package com.example.user.controllers;

import com.example.user.models.User;
import com.example.user.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")  // Fixed: was missing closing brace
    public ResponseEntity<User> getUserById(
            @PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<Long> getUserIdByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getId());
    }


    // In UserController.java (user service)
    @GetMapping("/username-details/{username}")
    public ResponseEntity<User> getUserDetailsByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
} 