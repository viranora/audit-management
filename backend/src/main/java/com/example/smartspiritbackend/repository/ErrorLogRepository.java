package com.example.smartspiritbackend.repository;

import com.example.smartspiritbackend.model.ErrorLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long> {
}
