package com.example.smartspiritbackend.aspect;

import com.example.smartspiritbackend.security.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

//burası bir bean olacak, bunu annote ederek kullanacağız
@Aspect
@Component
@RequiredArgsConstructor
public class CheckRoleAspect {

    private final HttpServletRequest request;
    private final JwtUtil jwtUtil; // constructor injection
    @Value("${mySecretKey}")
    private String mySecretKey;
    @Before("@annotation(com.example.smartspiritbackend.aspect.CheckRole)")
    public void validateRole(CheckRole checkRole) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        //Header ve tokenı httpservlet ile alıyoruz
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header missing or invalid");
        }
        //Baştaki Bearer kısmını atıyoruz
        String token = authHeader.substring(7);

        //JWT'den claimlerin hepsini alıyoruz ve içinden de rolü çekiyoruz
        Claims claims = Jwts.parser().setSigningKey(mySecretKey).parseClaimsJws(token).getBody();
        String jwtRole = claims.get("role", String.class);
        System.out.println("Rol şuan bu: "+jwtRole);
        //Annotation'daki parametre olarak verilen değerle karşılaştırıyoruz
        boolean hasRole = ("ROLE_" + checkRole.value()).equals(jwtRole);
        System.out.println("Aspect Authentication: " + auth);
        System.out.println("Aspect Authorities: " + auth.getAuthorities());
        System.out.println("Aspect jwtRole: " + jwtRole);
        System.out.println("Aspect hasRole: " + hasRole);
        if (!hasRole) {
            throw new RuntimeException("Invalid role");
        }
    }
}