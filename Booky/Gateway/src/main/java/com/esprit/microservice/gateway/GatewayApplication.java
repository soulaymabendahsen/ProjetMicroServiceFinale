package com.esprit.microservice.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("cart-service", r -> r.path("/carts/**")
                        .uri("lb://BOOKI"))
                .route("payment-service", r -> r.path("/payment/**")
                        .uri("lb://BOOKSTORE"))
                .route("user-service", r -> r.path("/api/**")
                        .uri("lb://USER-SERVICE"))
                .route("reclamation-service", r -> r.path("/api/complaints/**")
                        .uri("lb://COMPLAINT-SERVICE"))
                .route("book-service", r -> r.path("/**")
                        .uri("lb://GestionLivres"))


                .build();
    }

}



