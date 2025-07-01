package com.example.user.security;

import com.example.user.services.LoginAttemptService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Component
public class LoginAttemptFilter extends OncePerRequestFilter {

    @Autowired
    private LoginAttemptService loginAttemptService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        if (request.getRequestURI().equals("/api/auth/signin")) {
            String username = request.getParameter("username");
            if (username != null) {
                if (loginAttemptService.isBlocked(username)) {
                    long remainingTime = loginAttemptService.getLockTimeRemaining(username);
                    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                    response.getWriter().write("Account is temporarily locked. Please try again in " + 
                            TimeUnit.MILLISECONDS.toMinutes(remainingTime) + " minutes.");
                    return;
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
} 