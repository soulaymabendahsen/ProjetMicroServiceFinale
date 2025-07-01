package com.esprit.microservice.Booki.cart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {
        "com.esprit.microservice.Booki",  // Inclut tous tes composants
        "com.esprit.microservice.Booki.cart.config"
})
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.esprit.microservice.Booki") // Feign dans le même scope
public class BookiApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookiApplication.class, args);
    }
}
