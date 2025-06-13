package com.example.user.services;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class PasswordValidationService {
    
    private static final int MIN_LENGTH = 8;
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[!@#$%^&*(),.?\":{}|<>]");

    public boolean validatePassword(String password) {
        if (password == null || password.length() < MIN_LENGTH) {
            return false;
        }

        boolean hasUppercase = UPPERCASE_PATTERN.matcher(password).find();
        boolean hasLowercase = LOWERCASE_PATTERN.matcher(password).find();
        boolean hasDigit = DIGIT_PATTERN.matcher(password).find();
        boolean hasSpecialChar = SPECIAL_CHAR_PATTERN.matcher(password).find();

        return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
    }

    public String getPasswordRequirements() {
        return "Password must be at least " + MIN_LENGTH + " characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
} 