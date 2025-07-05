package com.example.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Base64;

/**
 * Web filter to log JWT tokens for debugging and monitoring purposes
 */
public class JwtLoggingWebFilter implements WebFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtLoggingWebFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        String method = exchange.getRequest().getMethod().toString();

        logger.info("Incoming request: {} {}", method, path);

        // Extract and log Authorization header
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Log token info (first 20 chars for security)
            logger.info("JWT Token present: {}...", token.substring(0, Math.min(20, token.length())));

            // Decode and log JWT payload (for debugging)
            try {
                String[] chunks = token.split("\\.");
                if (chunks.length >= 2) {
                    Base64.Decoder decoder = Base64.getUrlDecoder();
                    String payload = new String(decoder.decode(chunks[1]));
                    logger.debug("JWT Payload: {}", payload);
                }
            } catch (Exception e) {
                logger.warn("Failed to decode JWT payload: {}", e.getMessage());
            }
        } else {
            logger.info("No JWT token found in Authorization header");
        }

        return chain.filter(exchange);
    }
}
