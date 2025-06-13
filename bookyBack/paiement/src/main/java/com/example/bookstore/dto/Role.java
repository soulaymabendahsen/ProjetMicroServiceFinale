package com.example.bookstore.dto;

import lombok.Data;


@Data
public class Role {
    private Long id;
    private ERole name; // Must match your Role entity

}
