package com.example.bookstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import io.github.cdimascio.dotenv.Dotenv;

@Configuration
@Profile("!test") // Ne pas charger en environnement de test
public class EnvConfig {

    @Bean
    public Dotenv dotenv() {
        Dotenv dotenv = Dotenv.configure()
                .directory("./") // Chercher à la racine du projet
                .ignoreIfMissing()
                .load();

        // Vérification du chargement (pour debug)
        System.out.println("STRIPE_KEY chargée ? : " + (dotenv.get("STRIPE_SECRET_KEY") != null));
        return dotenv;
    }
}