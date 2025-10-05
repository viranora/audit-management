package com.example.smartspiritbackend.dto;

import lombok.Data;

@Data
public class UserAddRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String status;
    private String role;
}