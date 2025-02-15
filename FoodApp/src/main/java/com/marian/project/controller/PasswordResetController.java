package com.marian.project.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.marian.project.model.PasswordResetToken;
import com.marian.project.model.Registration;
import com.marian.project.repository.PasswordResetTokenRepository;
import com.marian.project.repository.RegisRepository;
import com.marian.project.service.PasswordResetService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetService resetService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private RegisRepository userRepository;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        resetService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("Password reset link has been sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expired");
        }

        Registration user = resetToken.getRegister();
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
        return ResponseEntity.ok("Password successfully reset");
    }
}