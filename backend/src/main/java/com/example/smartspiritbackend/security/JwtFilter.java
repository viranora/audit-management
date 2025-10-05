package com.example.smartspiritbackend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.example.smartspiritbackend.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Value("${mySecretKey}")
    private String mySecretKey;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String requestPath = request.getRequestURI();
        System.out.println("JWT Filter path: " + requestPath);

        // Bu endpoint'leri tamamen bypass et
        if (requestPath.equals("/api/user/refresh-token") ||
                requestPath.startsWith("/auth/") ||
                requestPath.equals("/error")) {
            System.out.println("JWT Filter bypass edildi: " + requestPath);
            filterChain.doFilter(request, response);
            return;
        }
        System.out.println("JWT Filter ÇALIŞIYOR path=" + request.getServletPath());
        //Login ve Register endpointlerini filtreleme, yani bu endpointlere gelen isteklerde token kontrolü yapmıyoruz
        String path = request.getServletPath();
        if (path.equals("/auth/login") || path.equals("/auth/register")) {
            filterChain.doFilter(request, response);
            return;
        }
        //önce null olarak token ve username değişkenlerini atıyoruz
        String token = null;
        String username = null;
        //1. önce request'in authorization headerini alıyoruz
        String authHeader = request.getHeader("Authorization");
        //2. eğer authorization headeri boş ise veya Bearer ile başlamıyorsa
        if(authHeader != null && authHeader.startsWith("Bearer ")){
            //2.1 tokenin Bearer'i atılmış kısmı olan yer olduğunu bildiğimizden önce Bearer'i atıyoruz sonra tokeni alıyoruz
            token = authHeader.substring(7);
            //2.2 tokeni kullanarak username'yi alıyoruz
            username = jwtUtil.extractUsername(token);
        }
        //3. eğer username boş değilse ve authenticate olmamış ise user
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = null;
            String role = null;
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(mySecretKey)
                        .parseClaimsJws(token)
                        .getBody();
                role = claims.get("role", String.class);
            } catch (Exception e) {
                // Token bozuksa veya expire olduysa, DB'den user çekmeye çalışacağız
            }
            if(role != null) {
                userDetails = org.springframework.security.core.userdetails.User
                        .withUsername(username)
                        .password("") // Şifreyi burada kullanmıyoruz
                        .authorities(role)
                        .build();
            } else {
                // Geri uyumluluk için DB'den çek
                userDetails = userDetailsService.loadUserByUsername(username);
            }
            System.out.println("JwtFilter username: " + username);
            System.out.println("JwtFilter role: " + role);
            System.out.println("JwtFilter userDetails: " + userDetails);
            System.out.println("JwtFilter authorities: " + userDetails.getAuthorities());
            System.out.println("JwtFilter validateToken: " + jwtUtil.validateToken(token, userDetails));
            System.out.println("JwtFilter context: " + SecurityContextHolder.getContext().getAuthentication());
            //3.2 tokeni username ile valide ediyoruz ve eğer doğru ise bu bu tokeni securitycontextholder'daki token yapıyoruz
            if(jwtUtil.validateToken(token, userDetails)){
                UsernamePasswordAuthenticationToken authToken  = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        //4. her bir requestte bu zincir devam etsin istiyoruz
        filterChain.doFilter(request, response);
    }
}