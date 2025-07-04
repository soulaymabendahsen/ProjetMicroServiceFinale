package com.esprit.microservice.Booki.cart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.esprit.microservice.Booki")
public class BookiApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookiApplication.class, args);
    }
}
