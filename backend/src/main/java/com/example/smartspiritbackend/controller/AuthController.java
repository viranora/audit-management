package com.example.smartspiritbackend.controller;

import jakarta.servlet.http.HttpServletRequest;
import com.example.smartspiritbackend.aspect.CheckStatus;
import com.example.smartspiritbackend.dto.LoginRequest;
import com.example.smartspiritbackend.dto.RegisterRequest;
import com.example.smartspiritbackend.model.Role;
import com.example.smartspiritbackend.model.User;
import com.example.smartspiritbackend.model.UserLog;
import com.example.smartspiritbackend.repository.ErrorLogRepository;
import com.example.smartspiritbackend.repository.RoleRepository;
import com.example.smartspiritbackend.repository.UserLogRepository;
import com.example.smartspiritbackend.repository.UserRepository;
import com.example.smartspiritbackend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class    AuthController {

    private final   AuthenticationManager authManager;

    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder;

    private final RoleRepository roleRepository;

    private final ErrorLogRepository errorLogRepo;

    private final UserLogRepository userLogRepository;

    public AuthController(AuthenticationManager authManager,
                          UserRepository userRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder, RoleRepository roleRepository, ErrorLogRepository errorLogRepo, UserLogRepository userLogRepository) {
        this.authManager = authManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.errorLogRepo = errorLogRepo;
        this.userLogRepository = userLogRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest){
        if(userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        else{
            User newUser = new User();
            newUser.setUsername(registerRequest.getUsername());
            //şifreyi encode ederek veriyoruz
            newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            // NormalUser rolünü buluyoruz
            Optional<Role> normalUserRole = roleRepository.findByName("NormalUser");
            if (normalUserRole.isEmpty()) {
                return ResponseEntity.badRequest().body("NormalUser rolü bulunamadı.");
            }
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPhone(registerRequest.getPhone());
            newUser.setRole(normalUserRole.get());
            newUser.setStatus("Active");
            userRepository.save(newUser);
            return ResponseEntity.ok("User registered successfully");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest){
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        //Burada token olmadığı için check status yerine direkt username ile repodan user çekip status kontrolü yapıyoruz
        if(!user.getStatus().equals("Active")){
            System.out.println("Kullanıcı aktif değil!" + user.getStatus());
            return ResponseEntity.status(403).body(Map.of("error", "User is not active"));
        }
        Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword()));
        if(auth.isAuthenticated()){
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            String refreshToken = jwtUtil.generateRefreshToken(loginRequest.getUsername());
            UserLog userLog = new UserLog();
            userLog.setUsername(loginRequest.getUsername());
            userLog.setAction("LOGIN");
            userLog.setTimestamp(LocalDateTime.now());
            userLogRepository.save(userLog);

            return ResponseEntity.ok(Map.of("token", token, "refreshToken", refreshToken));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }
    @CheckStatus
    @PostMapping("/quit")
    public ResponseEntity<String> quitUser(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = header.substring(7);
        String username = jwtUtil.extractUsername(token);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found!");
        }
        UserLog userLog = new UserLog();
        userLog.setUsername(username);
        userLog.setAction("LOGOUT");
        userLog.setTimestamp(LocalDateTime.now());
        userLogRepository.save(userLog);
        return ResponseEntity.ok("Quitted");
    }
    @GetMapping("/test")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok(Map.of("message", "kullanıcı doğrulandı").toString());
    }
}
