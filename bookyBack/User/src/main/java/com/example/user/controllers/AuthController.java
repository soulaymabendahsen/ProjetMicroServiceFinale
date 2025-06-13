package com.example.user.controllers;

import com.example.user.dtos.ErrorResponse;
import com.example.user.dtos.JwtResponse;
import com.example.user.dtos.LoginRequest;
import com.example.user.dtos.SignupRequest;
import com.example.user.models.ERole;
import com.example.user.models.Role;
import com.example.user.models.User;
import com.example.user.repositories.RoleRepository;
import com.example.user.repositories.UserRepository;
import com.example.user.security.jwt.JwtUtils;
import com.example.user.services.LoginAttemptService;
import com.example.user.services.PasswordValidationService;
import com.example.user.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.*;
import java.util.stream.Collectors;
import java.util.concurrent.TimeUnit;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private PasswordValidationService passwordValidationService;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();

        // Check if account is locked
        if (loginAttemptService.isBlocked(username)) {
            long remainingTime = loginAttemptService.getLockTimeRemaining(username);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ErrorResponse(
                            "Account locked",
                            "Too many failed attempts",
                            Map.of(
                                    "remaining_time_minutes", TimeUnit.MILLISECONDS.toMinutes(remainingTime),
                                    "unlock_time", new Date(System.currentTimeMillis() + remainingTime)
                            )
                    ));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    ));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            loginAttemptService.loginSucceeded(username);
            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles
            ));
        } catch (Exception e) {
            loginAttemptService.loginFailed(username);
            int remainingAttempts = loginAttemptService.getRemainingAttempts(username);

            ErrorResponse errorResponse;
            if (remainingAttempts > 0) {
                errorResponse = new ErrorResponse(
                        "Authentication failed",
                        "Invalid username or password",
                        Map.of(
                                "remaining_attempts", remainingAttempts)
                );
            } else {
                errorResponse = new ErrorResponse(
                        "Account locked",
                        "Too many failed attempts",
                        Map.of(
                                "lock_duration_minutes", TimeUnit.MILLISECONDS.toMinutes(LoginAttemptService.LOCK_TIME_DURATION)
                        )
                );
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse);
        }
    }
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest, BindingResult bindingResult) {
        // Validate username
        if (signUpRequest.getPassword().length() < 6 || signUpRequest.getPassword().length() > 40) {
            bindingResult.rejectValue("password", "size",
                    "Password must be between 6-40 characters");
        }

        // Check for any validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }

        // Rest of your existing logic
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Error: Email is already in use!");
        }

        if (!passwordValidationService.validatePassword(signUpRequest.getPassword())) {
            return ResponseEntity.badRequest()
                    .body("Error: " + passwordValidationService.getPasswordRequirements());
        }
        try {
            // Create new user's account
            User user = new User(
                    signUpRequest.getUsername(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword())
            );

            // Set roles
            Set<Role> roles = new HashSet<>();
            Set<String> strRoles = signUpRequest.getRoles();

            if (strRoles == null || strRoles.isEmpty()) {
                roles.add(roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("ROLE_USER not found")));
            } else {
                strRoles.forEach(role -> {
                    switch (role.toLowerCase()) {
                        case "admin":
                            roles.add(roleRepository.findByName(ERole.ROLE_ADMIN)
                                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found")));
                            break;
                        case "user":
                            roles.add(roleRepository.findByName(ERole.ROLE_USER)
                                    .orElseThrow(() -> new RuntimeException("ROLE_USER not found")));
                            break;
                        default:
                            throw new RuntimeException("Unsupported role: " + role);
                    }
                });
            }

            user.setRoles(roles);
            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "User registered successfully",
                    "userId", savedUser.getId()
            ));

        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "REGISTRATION_FAILED",
                            "message", "An error occurred during registration",
                            "details", ex.getMessage()
                    ));
        }
    }
}