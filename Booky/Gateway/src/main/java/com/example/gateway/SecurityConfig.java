package com.example.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeExchange(exchanges -> exchanges
                        // Public endpoints - no authentication required
                        .pathMatchers("/health", "/actuator/**").permitAll()
                        .pathMatchers("/carts/**").permitAll()
                        .pathMatchers("/books/**").permitAll()
                        .pathMatchers("/uploads/**").permitAll()
                        .pathMatchers("/api/complaints/**").permitAll()
                        .pathMatchers("/payment/**").permitAll()
                        // All other requests are allowed for now (disable security temporarily)
                        .anyExchange().permitAll())
                .build();
    }
}
