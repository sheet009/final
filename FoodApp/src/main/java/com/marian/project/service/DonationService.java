package com.marian.project.service;

import com.marian.project.model.Donation;
import com.marian.project.repository.DonationRepository;
import com.marian.project.repository.DonationRequestRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class DonationService {
    
    private final DonationRepository donationRepository;
    private static final Logger logger = LoggerFactory.getLogger(DonationService.class);
    
    @Autowired
    private DonationRequestRepository donationRequestRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    public Donation createDonation(Donation donation) {
        if (donation.getStatus() == null) {
            donation.setStatus("available");
        }
        return donationRepository.save(donation);
    }

    public List<Donation> getDonationsByEmail(String email) {
        if (email == null) {
            logger.error("Email parameter is null");
            return List.of();
        }
        try {
            logger.debug("Fetching donations for email: {}", email);
            List<Donation> donations = donationRepository.findByEmail(email.trim());
            logger.debug("Found {} donations", donations.size());
            return donations;
        } catch (Exception e) {
            logger.error("Error fetching donations for email: " + email, e);
            throw e;
        }
    }

    public List<Donation> getAvailableDonations() {
        return donationRepository.findByStatus("available");
    }

    public Donation getDonationById(Long id) {
        return donationRepository.findById(id).orElse(null);
    }

    public Donation updateDonation(Donation donation) {
        return donationRepository.save(donation);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    @Transactional
    public void deleteDonation(Long id) {
        // Delete the donation requests related to the donation
        donationRequestRepository.deleteByDonationId(id);
        
        // Now delete the donation itself
        donationRepository.deleteById(id);
    }   
    }

