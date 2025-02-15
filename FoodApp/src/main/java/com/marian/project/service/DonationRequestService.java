package com.marian.project.service;

import com.marian.project.model.Donation;
import com.marian.project.model.DonationRequest;
import com.marian.project.repository.DonationRequestRepository;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonationRequestService {

    private static final Logger logger = LoggerFactory.getLogger(DonationRequestService.class);

    @Autowired
    private DonationRequestRepository donationRequestRepository;

    // Save a new donation request
    public DonationRequest saveDonationRequest(DonationRequest donationRequest) {
        return donationRequestRepository.save(donationRequest);
    }

    // Get all donation requests with detailed information for admin
    public List<DonationRequest> getAllDonationRequests() {
        return donationRequestRepository.findAll();
    }

    // Get donation requests by recipient email
    public List<DonationRequest> getDonationRequestsByRecipientEmail(String email) {
        return donationRequestRepository.findByRecipientEmail(email);
    }

    // Get donation requests by donor email
    public List<DonationRequest> getDonationRequestsByDonorEmail(String email) {
        return donationRequestRepository.findByDonationEmail(email);
    }

    // Get a specific donation request by ID
    public DonationRequest getDonationRequestById(Long id) {
        Optional<DonationRequest> donationRequest = donationRequestRepository.findById(id);
        return donationRequest.orElse(null);
    }

    // Delete a donation request
    public void deleteDonationRequest(Long id) {
        donationRequestRepository.deleteById(id);
    }

    // Update the status of a donation request
    public DonationRequest updateRequestStatus(Long requestId, String status) {
        Optional<DonationRequest> optionalRequest = donationRequestRepository.findById(requestId);
        if (optionalRequest.isPresent()) {
            DonationRequest donationRequest = optionalRequest.get();
            donationRequest.setStatus(status);
            return donationRequestRepository.save(donationRequest);
        }
        return null;
    }

    // Method to approve a donation request
    public DonationRequest approveDonationRequest(Long id) {
        DonationRequest donationRequest = getDonationRequestById(id);
        if (donationRequest != null) {
            donationRequest.setStatus("APPROVED");
            
            // Ensure pickup address is set
            Donation donation = donationRequest.getDonation();
            if (donation != null) {
                String street = donation.getStreet();
                String city = donation.getCity();
                String postalCode = donation.getPostalCode();
                
                if (street != null && city != null && postalCode != null) {
                    String pickupAddress = String.format("%s, %s, %s", street, city, postalCode);
                    donationRequest.setPickupAddress(pickupAddress);
                    
                    logger.info("Pickup address set for donation request: {}", pickupAddress);
                } else {
                    logger.warn("Incomplete address information for donation request");
                }
            }
            
            return saveDonationRequest(donationRequest);
        }
        return null;
    }

    // Method to reject a donation request
    public DonationRequest rejectDonationRequest(Long id) {
        DonationRequest donationRequest = getDonationRequestById(id);
        if (donationRequest != null) {
            donationRequest.setStatus("REJECTED");
            return saveDonationRequest(donationRequest);
        }
        return null;
    }
    
    public DonationRequest markAsPickedUp(Long id) {
        DonationRequest donationRequest = getDonationRequestById(id);
        if (donationRequest != null && donationRequest.getStatus().equals("APPROVED")) {
            donationRequest.setStatus("PICKED_UP");
            return saveDonationRequest(donationRequest);
        }
        return null;
    }
    
    public DonationRequest markAsDelivered(Long id) {
        DonationRequest donationRequest = getDonationRequestById(id);
        if (donationRequest != null && donationRequest.getStatus().equals("PICKED_UP")) {
            donationRequest.setStatus("DELIVERED");
            return saveDonationRequest(donationRequest);
        }
        return null;
    }
    
    
}
