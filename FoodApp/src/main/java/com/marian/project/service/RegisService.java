package com.marian.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.marian.project.model.Registration;
import com.marian.project.repository.RegisRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class RegisService {

    @Autowired
    private RegisRepository registrationRepository;
    
   

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // In-memory token storage (replace with DB or cache for production)


    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public Registration saveRegistration(Registration registration) {
        String encryptedPassword = passwordEncoder.encode(registration.getPassword());
        registration.setPassword(encryptedPassword);
        return registrationRepository.save(registration);
    }

    public String deleteRegistration(Integer id) {
        registrationRepository.deleteById(id);
        return "Registration with ID " + id + " deleted successfully.";
    }

    public String updateRegistration(Integer id, Registration registration) {
        Registration existingRegistration = registrationRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Registration not found with ID " + id));

        if (registration.getPassword() != null && !registration.getPassword().equals(existingRegistration.getPassword())) {
            existingRegistration.setPassword(passwordEncoder.encode(registration.getPassword()));
        }

        existingRegistration.setName(registration.getName());
        existingRegistration.setContact(registration.getContact());
        existingRegistration.setLocation(registration.getLocation());
        existingRegistration.setFoodPreferences(registration.getFoodPreferences());
        existingRegistration.setRole(registration.getRole());

        registrationRepository.save(existingRegistration);
        return "Registration with ID " + id + " updated successfully.";
    }

    public Registration authenticate(String email, String password) {
        Registration user = registrationRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public String updatePasswordManually(Integer id, String newPassword) {
        String encryptedPassword = passwordEncoder.encode(newPassword);

        Registration existingRegistration = registrationRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Registration not found with ID " + id));

        existingRegistration.setPassword(encryptedPassword);
        registrationRepository.save(existingRegistration);

        return "Password updated successfully for ID " + id;
    }

    public List<Registration> getAllRegistrationsForAdmin() {
        List<Registration> allUsers = registrationRepository.findAll();
        return allUsers.stream()
                .filter(user -> !user.getRole().equals("ADMIN"))
                .collect(Collectors.toList());
    }

    public boolean isEmailExists(String email) {
        return registrationRepository.existsByEmail(email);
    }

   



}
