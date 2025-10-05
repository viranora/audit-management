package com.example.smartspiritbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_logs")
public class UserLog {
    @Id @GeneratedValue
    private Long id;
    private String username;
    private String action;
    private LocalDateTime timestamp;
}