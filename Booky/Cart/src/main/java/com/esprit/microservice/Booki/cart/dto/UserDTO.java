package com.esprit.microservice.Booki.cart.dto;

import lombok.Data;

import java.util.Set;

import com.esprit.microservice.Booki.cart.dto.Role;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Set<Role> roles;
}