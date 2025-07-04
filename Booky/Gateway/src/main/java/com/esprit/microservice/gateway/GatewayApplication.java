package com.esprit.microservice.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@SpringBootApplication
public class GatewayApplication {

        public static void main(String[] args) {
                SpringApplication.run(GatewayApplication.class, args);
        }

        @Bean
        public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
                return builder.routes()
                                // Health check route for testing
                                .route("health-check", r -> r.path("/health")
                                                .uri("forward:/actuator/health"))
                                .route("cart-service", r -> r.path("/carts/**")
                                                .uri("lb://cart-service")) // Fixed: matches docker service name
                                .route("payment-service", r -> r.path("/payment/**")
                                                .uri("lb://paiement-service")) // Fixed: matches docker service name
                                .route("user-service", r -> r.path("/api/users/**")
                                                .uri("lb://user-service")) // This seems correct
                                .route("complaint-service", r -> r.path("/api/complaints/**")
                                                .uri("lb://complaint-service")) // Fixed: matches docker service name
                                .route("book-service", r -> r.path("/books/**", "/ShowAllLivre", "/AjoutLivre", "/deleteLivre/**", "/UpdateLivre/**", "/getbookbyid/**", "/LivrePdf", "/upload", "/uploads/**", "/applyPromotion/**")
                                                .uri("lb://book-service")) // Fixed: matches actual Eureka registration name
                                                                            // from docker-compose
                                .build();
        }

        @Bean
        public CorsWebFilter corsWebFilter() {
                CorsConfiguration corsConfig = new CorsConfiguration();

                // Allow all origins for development (more permissive)
                corsConfig.addAllowedOriginPattern("*");

                // Allow credentials
                corsConfig.setAllowCredentials(true);
                corsConfig.setMaxAge(3600L);

                // Allow all methods
                corsConfig.addAllowedMethod("*");

                // Allow all headers
                corsConfig.addAllowedHeader("*");

                // Expose important headers
                corsConfig.addExposedHeader("*");

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", corsConfig);

                return new CorsWebFilter(source);
        }
}
