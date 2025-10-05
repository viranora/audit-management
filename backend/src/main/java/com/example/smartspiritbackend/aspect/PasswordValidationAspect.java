package com.example.smartspiritbackend.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import com.example.smartspiritbackend.dto.PasswordRequest;
import com.example.smartspiritbackend.dto.UserAddRequest;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PasswordValidationAspect {
    // PasswordValidationAspect.java
    @Before("@annotation(com.example.smartspiritbackend.aspect.PasswordValidation)")
    public void validatePasswordPolicy(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            String password = null;
            if (arg instanceof PasswordRequest passwordRequest) {
                password = passwordRequest.getNewPassword();
            } else if (arg instanceof UserAddRequest userAddRequest) {
                password = userAddRequest.getPassword();
            }
            if (password != null) {
                if (password.length() < 8) {
                    throw new RuntimeException("Parola en az 8 karakter olmalı");
                }
                for (int i = 0; i < password.length() - 2; i++) {
                    char c1 = password.charAt(i);
                    char c2 = password.charAt(i + 1);
                    char c3 = password.charAt(i + 2);
                    if (Character.isLetter(c1) && Character.isLetter(c2) && Character.isLetter(c3)) {
                        if ((c2 == c1 + 1 && c3 == c2 + 1) || (c2 == c1 - 1 && c3 == c2 - 1)) {
                            throw new RuntimeException("Parola ardışık 3 harf içeremez");
                        }
                    }
                    if (Character.isDigit(c1) && Character.isDigit(c2) && Character.isDigit(c3)) {
                        if ((c2 == c1 + 1 && c3 == c2 + 1) || (c2 == c1 - 1 && c3 == c2 - 1)) {
                            throw new RuntimeException("Parola ardışık 3 rakam içeremez");
                        }
                    }
                }
            }
        }
    }
}