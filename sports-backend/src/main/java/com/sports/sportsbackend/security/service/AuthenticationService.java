package com.sports.sportsbackend.security.service;

import com.sports.sportsbackend.model.Profile;
import com.sports.sportsbackend.model.User;
import com.sports.sportsbackend.repository.ProfileRepository;
import com.sports.sportsbackend.repository.UserRepository;
import com.sports.sportsbackend.security.dto.LoginDto;
import com.sports.sportsbackend.security.dto.RegisterDto;
import com.sports.sportsbackend.security.dto.VerifyDto;
import jakarta.mail.MessagingException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            EmailService emailService
            ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    @Transactional
    public User signup(RegisterDto input) {
        User user = new User(input.getUsername(),
                input.getEmail(),
                passwordEncoder.encode(input.getPassword()),
                input.getFirstName(),
                input.getLastName());
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationExpiration(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        User savedUser = userRepository.save(user);
        System.out.println("SUCCESS: User with ID " + savedUser.getId() + " and email " + savedUser.getEmail() + " was saved to the database.");
        sendVerificationEmail(user);

        Profile profile = new Profile();
        profile.setUser(user);
        profile.setUsername(savedUser.getUsername());
        profileRepository.save(profile);

        return savedUser;
    }

    public User authenticate(LoginDto input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.isEnabled()) throw new RuntimeException("Account not verified");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword())
        );
        return user;
    }

    public void verifyUser(VerifyDto input) {
        Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getVerificationExpiration().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code expired");
            }
            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationExpiration(null);
                userRepository.save(user);

                if (profileRepository.findByUserId(user.getId()).isEmpty()) {
                    Profile profile = new Profile();
                    profile.setUser(user);
                    profileRepository.save(profile);
                }
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else throw new RuntimeException("User not found");
    }

    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("User already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationExpiration(LocalDateTime.now().plusMinutes(15));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else throw new RuntimeException("User not found");
    }

    public void sendVerificationEmail(User user) {
        String subject = "Account Verification";
        String code = user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + code + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
