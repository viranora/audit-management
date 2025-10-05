package com.example.smartspiritbackend.controller;

import jakarta.servlet.http.HttpServletRequest;
import com.example.smartspiritbackend.aspect.CheckRole;
import com.example.smartspiritbackend.aspect.CheckStatus;
import com.example.smartspiritbackend.aspect.PasswordValidation;
import com.example.smartspiritbackend.dto.*;
import com.example.smartspiritbackend.model.ErrorLog;
import com.example.smartspiritbackend.model.Role;
import com.example.smartspiritbackend.model.User;
import com.example.smartspiritbackend.model.UserLog;
import com.example.smartspiritbackend.repository.ErrorLogRepository;
import com.example.smartspiritbackend.repository.RoleRepository;
import com.example.smartspiritbackend.repository.UserLogRepository;
import com.example.smartspiritbackend.repository.UserRepository;
import com.example.smartspiritbackend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RoleRepository roleRepository;
    private final UserLogRepository userLogRepository;
    private final ErrorLogRepository errorLogRepository;
    private final PasswordEncoder passwordEncoder; // <-- EKLE

    public UserController(UserRepository userRepository, JwtUtil jwtUtil, RoleRepository roleRepository, UserLogRepository userLogRepository, ErrorLogRepository errorLogRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.roleRepository = roleRepository;
        this.userLogRepository = userLogRepository;
        this.errorLogRepository = errorLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @CheckStatus
    @PasswordValidation
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(HttpServletRequest request, @RequestBody PasswordRequest passwordRequest) {
        String header = request.getHeader("Authorization");
        String token = header.substring(7);
        String username = jwtUtil.extractUsername(token);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found!");
        }
        User findedUser = user.get();

        UserLog userLog = new UserLog();
        userLog.setUsername(username);
        userLog.setAction("PASSWORD_CHANGE");
        userLog.setTimestamp(LocalDateTime.now());
        userLogRepository.save(userLog);

        findedUser.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));
        userRepository.save(findedUser);
        return ResponseEntity.ok("Password changed successfully");
    }

    //@CheckStatus
    @PostMapping("/refresh-token")
    public ResponseEntity<String> refreshToken(@RequestBody RefreshTokenRequest request) {
        System.out.println("=== REFRESH TOKEN ENDPOINT ===");
        System.out.println("Request alındı: " + request);

        try {
            String refreshToken = request.getRefreshToken();
            System.out.println("Refresh token null mu " + (refreshToken == null));
            System.out.println("Refresh token boş mu " + (refreshToken != null && refreshToken.isEmpty()));

            if (refreshToken == null || refreshToken.trim().isEmpty()) {
                System.out.println("Refresh token boş ya da eksik");
                return ResponseEntity.badRequest().body("Refresh token is required");
            }

            System.out.println("Token expiry kontrolü başlıyor");
            boolean isExpired = jwtUtil.isTokenExpired(refreshToken);
            System.out.println("Token expired mi?: " + isExpired);

            if (isExpired) {
                System.out.println("Refresh token süresi dolmuş");
                return ResponseEntity.status(401).body("Refresh token is expired");
            }

            System.out.println("Username çıkarılıyor");
            String username = jwtUtil.extractUsername(refreshToken);
            System.out.println("Çıkarılan username: " + username);

            System.out.println("Kullanıcı aranıyor");
            Optional<User> user = userRepository.findByUsername(username);
            System.out.println("Kullanıcı bulundu mu?: " + user.isPresent());

            if (user.isEmpty()) {
                System.out.println("Kullanıcı bulunamadı");
                return ResponseEntity.status(401).body("Invalid refresh token");
            }

            System.out.println("Yeni token oluşturuluyor");
            String newAccessToken = jwtUtil.generateToken(username);
            System.out.println("Yeni token oluşturuldu, uzunluğu: " + newAccessToken.length());

            System.out.println("User log kaydediliyor");
            UserLog userLog = new UserLog();
            userLog.setUsername(username);
            userLog.setAction("TOKEN_REFRESH");
            userLog.setTimestamp(LocalDateTime.now());
            userLogRepository.save(userLog);
            System.out.println("User log kaydedildi");

            System.out.println("=== REFRESH TOKEN BAŞARILI ===");
            return ResponseEntity.ok(newAccessToken);

        } catch (Exception e) {
            System.err.println("=== REFRESH TOKEN HATASI ===");
            System.err.println("Exception tipi: " + e.getClass().getSimpleName());
            System.err.println("Exception mesajı: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=== HATA SONU ===");

            return ResponseEntity.status(500).body("Token refresh failed");
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Admin rolü ile erişilebilecek endpointler

    @CheckStatus
    @CheckRole("Admin")
    @GetMapping("/get-all-users")
    public ResponseEntity<List<User>> getAllUsers() {
        System.out.println("Controller'a girildi!");
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @CheckStatus
    @CheckRole("Admin")
    @PostMapping("/add-user")
    @PasswordValidation
    public ResponseEntity<String> addUser(@RequestBody UserAddRequest newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        Optional<Role> normalUserRole = roleRepository.findByName("NormalUser");
        if (normalUserRole.isEmpty()) {
            throw new RuntimeException("NormalUser rolü bulunamadı.");
        }
        User user = new User();
        user.setUsername(newUser.getUsername());
        user.setPassword(passwordEncoder.encode(newUser.getPassword()));
        user.setEmail(newUser.getEmail());
        user.setPhone(newUser.getPhone());
        user.setStatus(newUser.getStatus());
        user.setRole(normalUserRole.get());
        userRepository.save(user);
        return ResponseEntity.ok("User added successfully");
    }

    @CheckStatus
    @CheckRole("Admin")
    @PostMapping("/delete-user")
    public ResponseEntity<String> deleteUser(@RequestBody String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok("User deleted successfully");
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @CheckStatus
    @CheckRole("Admin")
    @PostMapping("/mark-user-inactive")
    public ResponseEntity<String> markUserInactive(@RequestBody MarkAsInactiveRequest username) {
        Optional<User> user = userRepository.findByUsername(username.getUsername());
        if (user.isPresent()) {
            User findedUser = user.get();
            findedUser.setStatus("Inactive");
            userRepository.save(findedUser);
            return ResponseEntity.ok("User marked as inactive successfully");
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @CheckStatus
    @CheckRole("Admin")
    @PostMapping("/update-user-admin")
    public ResponseEntity<String> updateUserAdmin(@RequestBody UpdateUserRequestAdmin updateUserRequestAdmin) {
        String username = updateUserRequestAdmin.getUsername();
        Optional<Role> newRole = roleRepository.findByName(updateUserRequestAdmin.getRole());
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && newRole.isPresent()) {
            User findedUser = user.get();
            findedUser.setUsername(username);
            findedUser.setEmail(updateUserRequestAdmin.getEmail());
            findedUser.setPhone(updateUserRequestAdmin.getPhone());
            findedUser.setStatus(updateUserRequestAdmin.getStatus());
            findedUser.setRole(newRole.get());
            userRepository.save(findedUser);
            return ResponseEntity.ok("User updated successfully with admin role");
        } else {
            throw new RuntimeException("User or new role not found");
        }
    }
    @CheckStatus
    @CheckRole("Admin")
    @GetMapping("/get-user-logs")
    public ResponseEntity<List<UserLog>> getAllUserLogs() {
        List<UserLog> userLogs = userLogRepository.findAll();
        return ResponseEntity.ok(userLogs);
    }
    @CheckStatus
    @CheckRole("Admin")
    @GetMapping("/get-error-logs")
    public ResponseEntity<List<ErrorLog>> getAllErrorLogs() {
        List<ErrorLog> errorLogs = errorLogRepository.findAll();
        return ResponseEntity.ok(errorLogs);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Normal kullanıcıların erişebileceği endpointler

    @CheckStatus
    @PostMapping("/update-user")
    public ResponseEntity<String> updateUser(@RequestBody UpdateUserRequest updateUserRequest) {
        String username = updateUserRequest.getUsername();
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            User findedUser = user.get();
            findedUser.setEmail(updateUserRequest.getEmail());
            findedUser.setPhone(updateUserRequest.getPhone());
            userRepository.save(findedUser);
            return ResponseEntity.ok("User updated successfully");
        } else {
            throw new RuntimeException("User not found");
        }
    }
    @CheckStatus
    @PostMapping("/get-my-info")
    public ResponseEntity<User> getMyInfo(HttpServletRequest request) {
        System.out.println("=== GET MY INFO ENDPOINT ===");

        try {
            String header = request.getHeader("Authorization");
            System.out.println("Authorization header controlü " + (header != null));

            if (header == null || !header.startsWith("Bearer ")) {
                System.out.println("Header boş veya Bearer ile başlamıyor");
                throw new RuntimeException("Authorization header required");
            }

            String token = header.substring(7);

            String username = jwtUtil.extractUsername(token);

            System.out.println("Token'dan çıkarılan username: " + username);

            Optional<User> user = userRepository.findByUsername(username);

            if (user.isEmpty()) {
                System.out.println("Kullanıcı yok: " + username);
                throw new RuntimeException("User not found: " + username);
            }

            User foundUser = user.get();
            System.out.println("Bulunan kullanıcı " + foundUser.getUsername());
            System.out.println("Kullanıcı statusu " + foundUser.getStatus());
            System.out.println("Kullanıcı rolü " + (foundUser.getRole() != null ? foundUser.getRole().getName() : "null"));

            System.out.println("=== GET MY INFO BAŞARILI EXECUTE EDİLDİ ===");
            return ResponseEntity.ok(foundUser);

        } catch (Exception e) {
            System.err.println("=== GET MY INFO HATASI ===");
            System.err.println("Exception tipi " + e.getClass().getSimpleName());
            System.err.println("Exception mesajı " + e.getMessage());
            e.printStackTrace();
            System.err.println("=== HATA SONU ===");
            throw e;
        }
    }
}