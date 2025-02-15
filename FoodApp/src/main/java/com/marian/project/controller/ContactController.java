package com.marian.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import com.marian.project.model.Contact;
import com.marian.project.service.ContactService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private JavaMailSender mailSender;

    // Get all contact messages (for admin view)
    @GetMapping
    public List<Contact> getAllMessages() {
        return contactService.getAllMessages();
    }

    // Respond to a contact message and send an email response
    @PostMapping("/{id}/response")
    public ResponseEntity<String> respondToMessage(@PathVariable Long id, @RequestBody Map<String, String> response) {
        String adminResponse = response.get("response");

        // Fetch the contact message by ID
        Contact message = contactService.getMessageById(id).orElse(null);
        if (message == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found.");
        }

        // Respond to the message and update the record
        boolean updated = contactService.respondToMessage(id, adminResponse);

        if (updated) {
            // Send email to the user's real email address
            try {
                sendEmail(
                    message.getEmail(), 
                    "Response to your Contact Message", 
                    "Dear " + message.getName() + ",\n\n" + adminResponse + "\n\nBest regards,\nAdmin Team"
                );
                return ResponseEntity.ok("Response sent and email delivered successfully!");
            } catch (MessagingException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Response recorded, but failed to send email.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error responding to the message.");
        }
    }

    // Create new contact message (for front-end users)
    @PostMapping
    public ResponseEntity<Contact> createContactMessage(@RequestBody Contact contactMessage) {
        Contact createdMessage = contactService.createContactMessage(contactMessage);
        return new ResponseEntity<>(createdMessage, HttpStatus.CREATED);
    }


    // Optional: Delete contact message (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContactMessage(@PathVariable Long id) {
        contactService.deleteContactMessage(id);
        return ResponseEntity.ok("Message deleted successfully.");
    }

    // Helper method to send email
    private void sendEmail(String toEmail, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom("sheethalsuresh2003@gmail.com");  // Update with your admin sender's email
        helper.setTo(toEmail);  // Recipient's real email
        helper.setSubject(subject);
        helper.setText(body);
        mailSender.send(message);
    }
    
    @PostMapping("/test-email")
    public ResponseEntity<String> sendTestEmail() {
        try {
            sendEmail("sheethalsuresh2003@gmail.com", "Test Subject", "Test Email Body");
            return ResponseEntity.ok("Test email sent successfully!");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send test email.");
        }
    }

}
