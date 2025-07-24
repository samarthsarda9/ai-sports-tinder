package com.sports.sportsbackend.security.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDto {

    private String email;
    private String password;
    private String username;
    private String firstName;
    private String lastName;
}
