package com.microservice.gestionlivres.Entites;

import lombok.Data;

import java.util.Set;



@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Set<Role> roles;
}