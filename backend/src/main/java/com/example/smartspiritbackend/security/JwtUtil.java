package com.example.smartspiritbackend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import com.example.smartspiritbackend.model.User;
import com.example.smartspiritbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class JwtUtil {
    //Secret key için bir tanımlama yapıyoruz
    @Value("${mySecretKey}")
    private String mySecretKey;
    //Token expiration zamanını 3dk olarak belirliyoruz
    private long myExpirationTime = 180000;
    // Refresh token için daha uzun bir süre belirliyoruz
    private long refreshTokenExpiration = 604800000;
    private final UserRepository userRepository;

    public JwtUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(String username){
        //Username ile user'ı buluyoruz
        Optional<User> user = userRepository.findByUsername(username);
        //Şimdi claim'leri ayarlayıp bunu jwt'ye ekleyeceğiz
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("email", user.get().getEmail());
        claims.put("user_status", user.get().getStatus());
        claims.put("role", "ROLE_" + user.get().getRole().getName()); // <-- Dikkat!
        //Şimdi de claimleri token'a ekleyelim
        return Jwts.builder()
                .setClaims(claims) // önce claims!
                .setSubject(username) // sonra subject!
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + myExpirationTime))
                .signWith(SignatureAlgorithm.HS256, mySecretKey)
                .compact();

    }
    // Sadece username ile refresh token oluşturur
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(SignatureAlgorithm.HS256, mySecretKey)
                .compact();
    }
    //burada subjectten usernameyi alıyoruz
    public String extractUsername(String token){
        return Jwts.parser()
                .setSigningKey(mySecretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();//burada subject olarak atadığımız usernameyi çağırıyoruz
    }
    //burada tokenin süresinin dolup dolmadığını kontrol ediyoruz
    public Boolean isTokenExpired(String token){
        return Jwts.parser().setSigningKey(mySecretKey).parseClaimsJws(token).getBody().getExpiration().before(new Date());
    }
    //burada tokenin geçerli olup olmadığını ve süresinin dolup dolmadığını kontrol ediyoruz
    public Boolean validateToken(String token, UserDetails userDetails){
        //tokenin username ile eşleşip eşleşmediğini kontrol ediyoruz
        String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
