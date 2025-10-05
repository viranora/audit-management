package com.example.smartspiritbackend.config;

import com.example.smartspiritbackend.model.Role;
import com.example.smartspiritbackend.model.User;
import com.example.smartspiritbackend.repository.RoleRepository;
import com.example.smartspiritbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public void run(String... args) {
        if (roleRepository.findByName("Admin").isEmpty()) {
            roleRepository.save(new Role(null, "Admin"));
        }
        if (roleRepository.findByName("NormalUser").isEmpty()) {
            roleRepository.save(new Role(null, "NormalUser"));
        }
        if (userRepository.findByUsername("admin").isEmpty()) {
            Role adminRole = roleRepository.findByName("Admin").get();
            userRepository.save(new User(null, "admin", passwordEncoder.encode("12345678"), null, null, "Active", adminRole));
        }
    }
}