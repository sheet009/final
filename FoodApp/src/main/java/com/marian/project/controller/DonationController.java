package com.marian.project.controller;

import com.marian.project.model.Donation;
import com.marian.project.repository.DonationRepository;
import com.marian.project.repository.DonationRequestRepository;
import com.marian.project.repository.RegisRepository;
import com.marian.project.service.DonationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import com.marian.project.service.DonationRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DonationController {
    
    private static final Logger logger = LoggerFactory.getLogger(DonationController.class);
    private final DonationService donationService;
    private final DonationRequestService donationRequestService;
    private final DonationRepository donationRepository;
    private final DonationRequestRepository donationRequestRepository;
    private final RegisRepository regisRepository;

    // Constructor to inject dependencies
    public DonationController(DonationService donationService, 
                              DonationRequestService donationRequestService, 
                              DonationRepository donationRepository,
                              DonationRequestRepository donationRequestRepository,
                              RegisRepository regisRepository) {
        this.donationService = donationService;
        this.donationRequestService = donationRequestService;
        this.donationRepository = donationRepository;
        this.donationRequestRepository = donationRequestRepository;
        this.regisRepository = regisRepository;
    }

    // Public endpoints
    @GetMapping("/donations/available")
    public ResponseEntity<List<Donation>> getAvailableDonations() {
        logger.debug("Retrieving available donations");
        try {
            List<Donation> availableDonations = donationService.getAvailableDonations();
            return ResponseEntity.ok(availableDonations);
        } catch (Exception e) {
            logger.error("Error retrieving available donations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/donations/donor/{email}")
    public ResponseEntity<List<Donation>> getDonationsByDonorEmail(@PathVariable String email) {
        try {
            List<Donation> donations = donationService.getDonationsByEmail(email);
            if (donations.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PreAuthorize("hasRole('DONOR')")
    @PostMapping("/donations")
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        logger.debug("Creating new donation: {}", donation);
        try {
            Donation createdDonation = donationService.createDonation(donation);
            return new ResponseEntity<>(createdDonation, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating donation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // Admin endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/donations/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API is working");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/donations/all")
    public ResponseEntity<List<Donation>> getAllDonations() {
        logger.debug("Retrieving all donations");
        try {
            List<Donation> allDonations = donationService.getAllDonations();
            logger.info("Successfully retrieved {} donations", allDonations.size());
            return ResponseEntity.ok(allDonations);
        } catch (Exception e) {
            logger.error("Error retrieving all donations", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/donations/{id}")
    public ResponseEntity<?> updateDonation(@PathVariable Long id, @RequestBody Donation donation) {
        try {
            Donation existingDonation = donationService.getDonationById(id);
            if (existingDonation == null) {
                return new ResponseEntity<>("Donation not found.", HttpStatus.NOT_FOUND);
            }
            
            existingDonation.setQuantity(donation.getQuantity());
            existingDonation.setStatus(donation.getStatus());
            donationService.updateDonation(existingDonation);
            
            return ResponseEntity.ok(existingDonation);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating donation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/donations/{id}")
    @Transactional
    public ResponseEntity<String> deleteDonation(@PathVariable Long id) {
        try {
            // Ensure related donation requests are deleted first (if necessary)
            donationRequestRepository.deleteByDonationId(id);

            // Now delete the donation itself
            Donation donation = donationService.getDonationById(id);
            if (donation == null) {
                return new ResponseEntity<>("Donation not found.", HttpStatus.NOT_FOUND);
            }

            donationService.deleteDonation(id);
            return ResponseEntity.ok("Donation and related requests deleted successfully.");
        } catch (Exception e) {
            logger.error("Error deleting donation with id {}: {}", id, e.getMessage());
            return new ResponseEntity<>("Error deleting donation: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


  

}
