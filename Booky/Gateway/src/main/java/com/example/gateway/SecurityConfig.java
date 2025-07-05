package com.example.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.core.convert.converter.Converter;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        logger.info("🔐 Configuring Security Web Filter Chain with JWT validation");

        return http
                .csrf(csrf -> csrf.disable())
                .authorizeExchange(exchanges -> exchanges
                        // Public endpoints (no authentication required)
                        .pathMatchers("/health", "/actuator/**").permitAll()

                        // Role-based access control
                        .pathMatchers("/books/**").hasAuthority("ROLE_USER")
                        .pathMatchers("/api/complaints/**").hasAuthority("ROLE_ADMIN")

                        // Authenticated access (any valid token)
                        .pathMatchers("/payment/**").authenticated()
                        .pathMatchers("/carts/**").authenticated()

                        // Default: require authentication for all other endpoints
                        .anyExchange().authenticated())

                // Configure OAuth2 Resource Server with JWT
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtDecoder(reactiveJwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())))

                // Add custom logging filter before authentication processing
                .addFilterBefore(new CustomJwtAuthenticationFilter(), SecurityWebFiltersOrder.AUTHENTICATION)

                .build();
    }

    @Bean
    public ReactiveJwtDecoder reactiveJwtDecoder() {
        logger.info("🔧 Configuring JWT decoder with JWK Set URI: {}", jwkSetUri);
        return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }

    @Bean
    public ReactiveJwtAuthenticationConverterAdapter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter());
        return new ReactiveJwtAuthenticationConverterAdapter(converter);
    }

    @Bean
    public Converter<Jwt, Collection<GrantedAuthority>> jwtGrantedAuthoritiesConverter() {
        return new CustomJwtGrantedAuthoritiesConverter();
    }

    /**
     * Custom JWT authorities converter that extracts roles from Keycloak token
     */
    public static class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

        private static final Logger logger = LoggerFactory.getLogger(CustomJwtGrantedAuthoritiesConverter.class);

        @Override
        public Collection<GrantedAuthority> convert(Jwt jwt) {
            logger.info("🛡️ Converting JWT authorities for user: {}", jwt.getClaimAsString("preferred_username"));

            // Extract realm roles from Keycloak token
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            Collection<String> realmRoles = null;

            if (realmAccess != null) {
                realmRoles = (Collection<String>) realmAccess.get("roles");
                logger.debug("📋 Realm roles found: {}", realmRoles);
            } else {
                logger.warn("⚠️ No realm_access claim found in JWT token");
            }

            // Extract resource roles (if any) - for client-specific roles
            Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
            if (resourceAccess != null) {
                logger.debug("📋 Resource access found: {}", resourceAccess.keySet());
                // You can extract roles from specific clients here if needed
                // Example: Map<String, Object> clientRoles = (Map<String, Object>)
                // resourceAccess.get("your-client-id");
            }

            // Combine and convert to GrantedAuthority with ROLE_ prefix
            Stream<String> authorities = Stream.empty();

            if (realmRoles != null) {
                authorities = Stream.concat(authorities,
                        realmRoles.stream().map(role -> "ROLE_" + role.toUpperCase()));
            }

            Collection<GrantedAuthority> grantedAuthorities = authorities
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toSet());

            logger.info("✅ Granted authorities: {}", grantedAuthorities);
            return grantedAuthorities;
        }
    }
}