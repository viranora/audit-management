package com.example.smartspiritbackend.aspect;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Aspect
@Component
@RequiredArgsConstructor
public class CheckStatusAspect {

    private final HttpServletRequest request;
    @Value("${mySecretKey}")
    private String mySecretKey;
    @Before("@annotation(com.example.smartspiritbackend.aspect.CheckStatus)")
    public void checkStatus(JoinPoint joinPoint) {
        // Annotation'dan izin verilen status değerini çek
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        CheckStatus checkStatus = method.getAnnotation(CheckStatus.class);
        String allowedStatus = checkStatus.value();

        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header missing or invalid");
        }
        String token = auth.substring(7);

        Claims claims = Jwts.parser().setSigningKey(mySecretKey).parseClaimsJws(token).getBody();
        String status = claims.get("user_status", String.class);
        System.out.println("Claims: " + claims);
        System.out.println("Claims keys: " + claims.keySet());
        System.out.println("user_status: " + claims.get("user_status"));
        System.out.println("role: " + claims.get("role"));
        System.out.println("username: " + claims.get("username"));
        System.out.println("sub: " + claims.get("sub"));
        // Sadece istenen status'a sahip kullanıcıya izin ver
        if (!allowedStatus.equals(status)) {
            throw new RuntimeException("User status is not valid! Required: " + allowedStatus + ", Actual: " + status);
        }
    }
}