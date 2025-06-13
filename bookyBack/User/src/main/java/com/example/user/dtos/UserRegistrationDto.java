package com.example.user.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;



@Data
public class UserRegistrationDto {
    @NotBlank
    private String username;

    @NotBlank
    @Size(min = 6)
    private String password;

    @Email
    private String email;
}
