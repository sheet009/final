package com.marian.project.repository;

import com.marian.project.model.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {

    // Custom query to fetch DonationRequests based on donor email
    @Query("SELECT dr FROM DonationRequest dr WHERE dr.donation.email = :donorEmail")
    List<DonationRequest> findByDonationEmail(@Param("donorEmail") String email);

    // Find requests by recipient's email
    List<DonationRequest> findByRecipientEmail(String recipientEmail);

    // Method to delete DonationRequest by donationId
    
    void deleteByDonationId(Long donationId);// Updated to reference the 'donation' object with the correct field name
}
