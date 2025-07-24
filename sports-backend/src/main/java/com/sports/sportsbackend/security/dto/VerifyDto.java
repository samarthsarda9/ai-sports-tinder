package com.sports.sportsbackend.security.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyDto {

    private String email;
    private String verificationCode;
}
