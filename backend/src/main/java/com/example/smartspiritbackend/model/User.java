package com.example.smartspiritbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users")
@AllArgsConstructor
public class User {
    @Id @GeneratedValue
    private Long id;

    private String username;
    private String password;
    private String email;
    private String phone;
    private String status = "Active";

    @ManyToOne
    private Role role;
}
