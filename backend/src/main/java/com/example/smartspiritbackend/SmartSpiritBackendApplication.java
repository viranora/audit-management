package com.example.smartspiritbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy 
public class SmartSpiritBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartSpiritBackendApplication.class, args);
	}

}
