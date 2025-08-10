package com.sports.sportsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SportsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SportsBackendApplication.class, args);
    }

}
