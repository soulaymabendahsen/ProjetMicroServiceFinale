package com.example.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class AuthTestController {

    private static final Logger logger = LoggerFactory.getLogger(AuthTestController.class);

    /**
     * Test endpoint to validate JWT authentication and role extraction
     */
    @GetMapping("/auth-test")
    public Mono<Map<String, Object>> testAuth(Authentication authentication) {
        logger.info("🧪 Auth test endpoint called");

        Map<String, Object> response = new HashMap<>();

        if (authentication != null) {
            logger.info("✅ Authentication found: {}", authentication.getClass().getSimpleName());

            response.put("authenticated", true);
            response.put("principal", authentication.getName());
            response.put("authorities", authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));

            // If JWT, extract additional claims
            if (authentication.getPrincipal() instanceof Jwt) {
                Jwt jwt = (Jwt) authentication.getPrincipal();
                response.put("username", jwt.getClaimAsString("preferred_username"));
                response.put("email", jwt.getClaimAsString("email"));
                response.put("sub", jwt.getSubject());
                response.put("iss", jwt.getIssuer());
                response.put("exp", jwt.getExpiresAt());

                // Realm roles
                Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
                if (realmAccess != null) {
                    response.put("realmRoles", realmAccess.get("roles"));
                }

                logger.info("🔍 JWT Claims extracted for user: {}", jwt.getClaimAsString("preferred_username"));
            }
        } else {
            logger.warn("❌ No authentication found");
            response.put("authenticated", false);
            response.put("message", "No authentication present");
        }

        return Mono.just(response);
    }

    /**
     * Health check endpoint (public)
     */
    @GetMapping("/health")
    public Mono<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Gateway");
        status.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return Mono.just(status);
    }
}
