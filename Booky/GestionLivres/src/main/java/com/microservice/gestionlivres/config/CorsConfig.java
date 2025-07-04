package main.java.com.microservice.gestionlivres.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Temporarily disable CORS here - let Gateway handle it
                // registry.addMapping("/**") // Allow all endpoints
                // .allowedOriginPatterns("*") // Use allowedOriginPatterns instead of
                // allowedOrigins with
                // // credentials
                // .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Include OPTIONS
                // for preflight
                // .allowedHeaders("*") // Allow all headers
                // .allowCredentials(true) // Allow credentials
                // .maxAge(3600); // Cache preflight response
            }
        };
    }
}
