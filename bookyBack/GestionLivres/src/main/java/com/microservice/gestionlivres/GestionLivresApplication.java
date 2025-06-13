package com.microservice.gestionlivres;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class GestionLivresApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionLivresApplication.class, args);
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")  // Spécifiez le path de votre API
                        .allowedOriginPatterns(
                                "http://localhost:[*]",  // Autorise tous les ports
                                "http://127.0.0.1:[*]",
                                "http://192.168.[0-9]*.[0-9]*:[*]"  // IP locales
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}