package com.marian.project.controller;

import com.marian.project.model.Donation;
import com.marian.project.model.DonationRequest;
import com.marian.project.repository.DonationRepository;
import com.marian.project.service.DonationRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DonationRequestController {

    private static final Logger logger = LoggerFactory.getLogger(DonationRequestController.class);

    @Autowired
    private DonationRequestService donationRequestService;

    @Autowired
    private DonationRepository donationRepository;

    // Public endpoints
    @PostMapping("/donations/requests")
    public ResponseEntity<String> createDonationRequest(@RequestBody DonationRequest donationRequest) {
        logger.debug("Received donation request: {}", donationRequest);

        // Validate basic request data
        if (donationRequest == null) {
            return new ResponseEntity<>("Request body is null", HttpStatus.BAD_REQUEST);
        }

        if (donationRequest.getDonation() == null) {
            return new ResponseEntity<>("Donation details are missing", HttpStatus.BAD_REQUEST);
        }

        if (donationRequest.getRecipientEmail() == null || donationRequest.getRecipientEmail().trim().isEmpty()) {
            return new ResponseEntity<>("Recipient email is required", HttpStatus.BAD_REQUEST);
        }

        Long donationId = donationRequest.getDonation().getId();
        if (donationId == null) {
            return new ResponseEntity<>("Donation ID is missing", HttpStatus.BAD_REQUEST);
        }

        Optional<Donation> donationOptional = donationRepository.findById(donationId);
        if (!donationOptional.isPresent()) {
            return new ResponseEntity<>("Donation not found with ID: " + donationId, HttpStatus.NOT_FOUND);
        }

        Donation donation = donationOptional.get();
        if (!donation.getStatus().equalsIgnoreCase("AVAILABLE")) {
            return new ResponseEntity<>("Donation is not available for request. Current status: " + donation.getStatus(),
                    HttpStatus.BAD_REQUEST);
        }

        // Check if there's enough quantity for the donation
        if (donationRequest.getQuantity() <= 0) {
            return new ResponseEntity<>("Requested quantity must be greater than 0", HttpStatus.BAD_REQUEST);
        }

        if (donation.getQuantity() < donationRequest.getQuantity()) {
            return new ResponseEntity<>("Not enough quantity available", HttpStatus.BAD_REQUEST);
        }

        // Set initial status to PENDING
        donationRequest.setStatus("PENDING");
        donationRequest.setRequestTime(LocalDateTime.now());
        donationRequest.setDonation(donation);

        // Update the quantity of the donation
        donation.setQuantity(donation.getQuantity() - donationRequest.getQuantity());

        try {
            donationRepository.save(donation);  // Save the updated donation with decreased quantity
            donationRequestService.saveDonationRequest(donationRequest);
            return new ResponseEntity<>("Donation request created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error saving donation request", e);
            return new ResponseEntity<>("Error creating donation request: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/donations/requests/recipient/{email}")
    public ResponseEntity<List<DonationRequest>> getRecipientRequests(@PathVariable String email) {
        try {
            List<DonationRequest> requests = donationRequestService.getDonationRequestsByRecipientEmail(email);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error retrieving recipient requests for email: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Admin endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/donations/requests")
    public ResponseEntity<List<DonationRequest>> getAllDonationRequests() {
        try {
            List<DonationRequest> donationRequests = donationRequestService.getAllDonationRequests();
            return ResponseEntity.ok(donationRequests);
        } catch (Exception e) {
            logger.error("Error retrieving donation requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/donations/requests/donor/{email}")
    public ResponseEntity<List<DonationRequest>> getDonorRequests(@PathVariable String email) {
        try {
            List<DonationRequest> requests = donationRequestService.getDonationRequestsByDonorEmail(email);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            logger.error("Error retrieving donor requests for email: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

 
    @PutMapping("/donations/requests/{id}/approve")
    public ResponseEntity<DonationRequest> approveDonationRequest(@PathVariable Long id) {
        DonationRequest donationRequest = donationRequestService.getDonationRequestById(id);

        if (donationRequest == null) {
            logger.error("Donation request not found for ID: {}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Explicitly set pickup address
        Donation donation = donationRequest.getDonation();
        if (donation != null) {
            String pickupAddress = String.format("%s, %s, %s", 
                donation.getStreet(), 
                donation.getCity(), 
                donation.getPostalCode());
            donationRequest.setPickupAddress(pickupAddress);
        }

        // Call the service method to approve the donation request
        DonationRequest approvedRequest = donationRequestService.approveDonationRequest(id);
        
        if (approvedRequest != null) {
            return ResponseEntity.ok(approvedRequest);
        } else {
            logger.error("Error approving donation request for ID: {}", id);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/donations/requests/{id}/reject")
    public ResponseEntity<String> rejectDonationRequest(@PathVariable Long id) {
        DonationRequest donationRequest = donationRequestService.getDonationRequestById(id);

        if (donationRequest == null) {
            logger.error("Donation request not found for ID: {}", id);
            return new ResponseEntity<>("Donation request not found.", HttpStatus.NOT_FOUND);
        }

        donationRequest.setStatus("REJECTED");
        donationRequestService.saveDonationRequest(donationRequest);
        logger.info("Donation request rejected successfully for ID: {}", id);

        return ResponseEntity.ok("Donation request rejected successfully.");
    }
    

    // Endpoint for recipients to delete their donation requests
    @DeleteMapping("/donations/requests/{id}")
    public ResponseEntity<String> deleteDonationRequest(@PathVariable Long id, @RequestParam String email) {
        DonationRequest donationRequest = donationRequestService.getDonationRequestById(id);

        // Check if the request exists
        if (donationRequest == null) {
            return new ResponseEntity<>("Donation request not found.", HttpStatus.NOT_FOUND);
        }

        // Check if the request belongs to the recipient
        if (!donationRequest.getRecipientEmail().equalsIgnoreCase(email)) {
            return new ResponseEntity<>("You can only delete your own requests.", HttpStatus.FORBIDDEN);
        }

        try {
            donationRequestService.deleteDonationRequest(id);
            return new ResponseEntity<>("Donation request deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting donation request for ID: {}", id, e);
            return new ResponseEntity<>("Failed to delete donation request. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    @PutMapping("/donations/requests/{id}/pickup")
    public ResponseEntity<?> markAsPickedUp(@PathVariable Long id) {
        // Fetch the donation request by ID
        DonationRequest donationRequest = donationRequestService.getDonationRequestById(id);

        // Check if the donation request exists
        if (donationRequest == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // If not found, return 404
        }

        // Ensure the donation request has been approved before it can be picked up
        if (!"APPROVED".equalsIgnoreCase(donationRequest.getStatus())) {
            return new ResponseEntity<>("Donation request must be approved before it can be marked as picked up.", HttpStatus.BAD_REQUEST); // Return 400 if not approved
        }

        // Proceed to mark the donation request as picked up
        DonationRequest updatedRequest = donationRequestService.markAsPickedUp(id);
        if (updatedRequest != null) {
            return ResponseEntity.ok(updatedRequest); // Return the updated donation request as a response
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Return 400 if the update failed
        }
    }



    
    @PreAuthorize("hasRole('DONOR')")
    @PutMapping("/donations/requests/{id}/deliver")
    public ResponseEntity<DonationRequest> markAsDelivered(@PathVariable Long id) {
        DonationRequest updatedRequest = donationRequestService.markAsDelivered(id);
        if (updatedRequest != null) {
            return ResponseEntity.ok(updatedRequest); // Successful delivery
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Returns a 400 status if it cannot be delivered
        }
    }



    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/donations/requests/{id}")
    public ResponseEntity<String> deleteDonationRequestByAdmin(@PathVariable Long id) {
        DonationRequest donationRequest = donationRequestService.getDonationRequestById(id);

        if (donationRequest == null) {
            logger.error("Donation request not found for ID: {}", id);
            return new ResponseEntity<>("Donation request not found.", HttpStatus.NOT_FOUND);
        }

        donationRequestService.deleteDonationRequest(id);
        logger.info("Donation request deleted successfully for ID: {}", id);

        return ResponseEntity.ok("Donation request deleted successfully.");
    }
}