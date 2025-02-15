package com.marian.project.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.time.LocalDateTime;
import java.util.List;




@Entity
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String donorName;
    private String email;
    private String phone;
    private String foodType;
    private String foodName;
    private double quantity;
    private String street;
    private String city;
    private String postalCode;
    private LocalDateTime pickupTime;
    private String notes;

    private String status;  // donation status (available, requested, etc.)
    
    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL)
    private List<DonationRequest> donationRequests;


    // Getters and setters for all fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public LocalDateTime getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(LocalDateTime pickupTime) {
        this.pickupTime = pickupTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Donation [id=" + id + ", donorName=" + donorName + ", email=" + email + ", phone=" + phone + ", foodType=" + foodType
                + ", foodName=" + foodName + ", quantity=" + quantity + ", street=" + street + ", city=" + city + ", postalCode=" + postalCode
                + ", pickupTime=" + pickupTime + ", notes=" + notes + ", status=" + status + "]";
    }

    // Constructor with all properties, excluding recipient details
    public Donation(String donorName, String email, String phone, String foodType, String foodName, double quantity, String street,
                    String city, String postalCode, LocalDateTime pickupTime, String notes, String status) {
        this.donorName = donorName;
        this.email = email;
        this.phone = phone;
        this.foodType = foodType;
        this.foodName = foodName;
        this.quantity = quantity;
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.pickupTime = pickupTime;
        this.notes = notes;
        this.status = status;
    }

    // Default constructor
    public Donation() {
    }
}