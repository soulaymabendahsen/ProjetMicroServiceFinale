package com.microservice.gestionlivres;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.microservice.gestionlivres.Services")
public class GestionLivresApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionLivresApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*") // Now we can use * again
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(false) // Set to false to avoid CORS conflicts
                        .maxAge(3600);
            }
        };
    }
}
