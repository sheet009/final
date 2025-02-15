package com.marian.project.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import com.marian.project.model.PasswordResetToken;
import com.marian.project.model.Registration;
import com.marian.project.repository.PasswordResetTokenRepository;
import com.marian.project.repository.RegisRepository;


@Service
public class PasswordResetService {

    @Autowired
    private RegisRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String email) {
        Registration user = userRepository.findByEmail(email);
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(resetToken);

        String resetUrl = "TheToken needed for resseting your password is = " + token;
        sendEmail(email, resetUrl);
    }

    private void sendEmail(String to, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("Click the link to reset your password: " + resetUrl);
        mailSender.send(message);
    }
}