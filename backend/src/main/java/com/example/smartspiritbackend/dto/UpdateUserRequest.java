package com.example.smartspiritbackend.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    String username;
    String email;
    String phone;
}
