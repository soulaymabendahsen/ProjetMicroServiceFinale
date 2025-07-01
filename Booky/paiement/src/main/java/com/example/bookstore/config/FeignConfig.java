package com.example.bookstore.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


@Configuration
public class FeignConfig {


        @Bean
        public RequestInterceptor requestInterceptor() {
            return requestTemplate -> {
                RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
                if (requestAttributes != null) {
                    HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
                    String token = request.getHeader("Authorization");
                    if (token != null) {
                        requestTemplate.header("Authorization", token);
                        System.out.println("Forwarded Authorization header: " + token);
                    } else {
                        System.err.println("No Authorization header in original request");
                    }
                } else {
                    System.err.println("No request attributes available");
                }
            };
        }

}