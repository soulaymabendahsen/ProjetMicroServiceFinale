package com.microservice.gestionlivres;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.microservice.gestionlivres")
public class GestionLivresApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionLivresApplication.class, args);
    }

    // No CORS configuration here - Gateway handles all CORS
}
