package com.esprit.microservice.Booki.cart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients
@ComponentScan(basePackages = {"com.esprit.microservice.Booki", "com.esprit.microservice.Booki.cart.config"})
public class BookiApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookiApplication.class, args);
    }
}