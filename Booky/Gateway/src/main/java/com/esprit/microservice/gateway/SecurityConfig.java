package com.esprit.microservice.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

        /**
         * Defines the security rules for the Gateway.
         */
        @Bean
        public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
                return http
                                .csrf(csrf -> csrf.disable())
                                .authorizeExchange(exchanges -> exchanges
                                                .anyExchange().permitAll())
                                // OAuth2 resource server configuration removed to avoid JWT validation
                                .build();
        }

}
