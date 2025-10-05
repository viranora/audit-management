package com.example.smartspiritbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "error_logs")
public class ErrorLog {
    @Id
    @GeneratedValue
    private Long id;
    @Column(columnDefinition = "text")
    private String stackTrace;

    @Column(columnDefinition = "text")
    private String message;
    private LocalDateTime timestamp;
}