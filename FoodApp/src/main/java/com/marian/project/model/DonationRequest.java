package com.marian.project.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class DonationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientName;
    private String recipientEmail;
    private String recipientPhone;
    private double quantity;

    private LocalDateTime requestTime;
    private String status;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    // New field for pickup address, not stored in DB but added dynamically
    @Transient  // This annotation ensures this field is not persisted to the database
    private String pickupAddress;
    
    

    // Constructor
    public DonationRequest(String recipientName, String recipientEmail, String recipientPhone,
                           double quantity, LocalDateTime requestTime, String status, Donation donation) {
        this.recipientName = recipientName;
        this.recipientEmail = recipientEmail;
        this.recipientPhone = recipientPhone;
        this.quantity = quantity;
        this.requestTime = requestTime;
        this.status = status;
        this.donation = donation;

        // Set the pickup address
        if (donation != null) {
            this.pickupAddress = donation.getStreet() + ", " + donation.getCity() + ", " + donation.getPostalCode();
        }
    }

    // Default constructor
    public DonationRequest() {
        this.requestTime = LocalDateTime.now();  // Ensure request time is set during object creation
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(LocalDateTime requestTime) {
        this.requestTime = requestTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Donation getDonation() {
        return donation;
    }

    public void setDonation(Donation donation) {
        this.donation = donation;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }
}
