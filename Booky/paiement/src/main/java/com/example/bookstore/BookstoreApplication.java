package com.example.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients
public class BookstoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookstoreApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*") // Use allowedOriginPatterns instead of allowedOrigins
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Added OPTIONS for preflight
                        .allowedHeaders("*") // Autorise tous les en-têtes
                        .allowCredentials(false) // Explicitly set credentials to false for clarity
                        .maxAge(3600); // Cache preflight requests
            }
        };
    }

}
