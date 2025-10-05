package com.example.smartspiritbackend.repository;

import com.example.smartspiritbackend.model.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserLogRepository extends JpaRepository<UserLog, Long> {

}