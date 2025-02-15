package com.marian.project.controller;

import com.marian.project.model.Registration;
import com.marian.project.repository.RegisRepository;
import com.marian.project.service.RegisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class RegisController {

    @Autowired
    private RegisService registrationService;
    
    @Autowired
    private RegisRepository regisRepository;

    @GetMapping("/api/registration")
    public List<Registration> showAllRegistrations() {
        return registrationService.getAllRegistrations();
    }

    @PostMapping("/api/registration")
    public ResponseEntity<?> addRegistration(@RequestBody Registration registration) {
        if (registrationService.isEmailExists(registration.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email is already registered."));
        }
        Registration savedRegistration = registrationService.saveRegistration(registration);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRegistration);
    }

    @DeleteMapping("/api/registration/{id}")
    public String removeRegistration(@PathVariable Integer id) {
        return registrationService.deleteRegistration(id);
    }

    @PutMapping("/api/registration/{id}")
    public String updateRegistration(@PathVariable Integer id, @RequestBody Registration registration) {
        return registrationService.updateRegistration(id, registration);
    }
    @GetMapping("/api/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = regisRepository.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/api/login")
    public ResponseEntity<?> login(HttpSession session, @RequestBody Registration loginRequest) {
        Registration user = registrationService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (user != null) {
            session.setAttribute("user", user);
            return ResponseEntity.ok(Map.of(
                "message", "Login successful! Welcome " + user.getName(),
                "role", user.getRole(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getContact(),
                "loginStatus", "success"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "message", "Login failed: Invalid email or password.",
                "loginStatus", "failed"
            ));
        }
    }

    @GetMapping("/api/session")
    public ResponseEntity<?> checkSession(HttpSession session) {
        Registration user = (Registration) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(Map.of(
                "message", "Session is valid.",
                "user", user
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "message", "No active session. Please log in."
        ));
    }

    @PostMapping("/api/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logout successful."));
    }

    @GetMapping("/api/admin/users")
    public List<Registration> showAllUsers() {
        return registrationService.getAllRegistrationsForAdmin();
    }

    


}
