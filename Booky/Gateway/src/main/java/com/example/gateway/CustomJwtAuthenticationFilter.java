package com.example.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Base64;

/**
 * JWT Logging Filter for debugging and monitoring JWT tokens
 * This filter logs incoming JWT tokens and their basic information
 */
public class CustomJwtAuthenticationFilter implements WebFilter {

    private static final Logger logger = LoggerFactory.getLogger(CustomJwtAuthenticationFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        String method = exchange.getRequest().getMethod().toString();

        logger.info("🔍 Processing request: {} {}", method, path);

        // Extract and log Authorization header
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Log token info (first 30 chars for security)
            logger.info("🔐 JWT Token detected: {}...", token.substring(0, Math.min(30, token.length())));

            // Decode and log JWT payload for debugging
            try {
                String[] chunks = token.split("\\.");
                if (chunks.length >= 2) {
                    Base64.Decoder decoder = Base64.getUrlDecoder();
                    String payload = new String(decoder.decode(chunks[1]));
                    logger.debug("📄 JWT Payload: {}", payload);

                    // Extract key information from payload
                    if (payload.contains("preferred_username")) {
                        String username = extractJsonValue(payload, "preferred_username");
                        logger.info("👤 User: {}", username);
                    }

                    if (payload.contains("realm_access")) {
                        logger.info("🛡️ Token contains realm_access roles");
                    }

                    if (payload.contains("exp")) {
                        String exp = extractJsonValue(payload, "exp");
                        logger.info("⏰ Token expires at: {}", exp);
                    }
                }
            } catch (Exception e) {
                logger.warn("⚠️ Failed to decode JWT payload: {}", e.getMessage());
            }
        } else {
            logger.info("🔓 No JWT token found - proceeding without authentication");
        }

        return chain.filter(exchange);
    }

    /**
     * Simple JSON value extractor for debugging purposes
     */
    private String extractJsonValue(String json, String key) {
        try {
            String searchKey = "\"" + key + "\":";
            int startIndex = json.indexOf(searchKey);
            if (startIndex != -1) {
                startIndex += searchKey.length();
                // Skip whitespace and quotes
                while (startIndex < json.length()
                        && (json.charAt(startIndex) == ' ' || json.charAt(startIndex) == '"')) {
                    startIndex++;
                }
                int endIndex = startIndex;
                // Find end of value (comma, closing brace, or quote)
                while (endIndex < json.length() && json.charAt(endIndex) != ',' && json.charAt(endIndex) != '}'
                        && json.charAt(endIndex) != '"') {
                    endIndex++;
                }
                return json.substring(startIndex, endIndex);
            }
        } catch (Exception e) {
            logger.debug("Failed to extract {} from JSON", key);
        }
        return "unknown";
    }
}