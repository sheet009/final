package com.marian.project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String email;
    private String password;
    private String contact;
    private String location;
    private String foodPreferences; // Specific to donors
    private String role;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getFoodPreferences() {
        return foodPreferences;
    }

    public void setFoodPreferences(String foodPreferences) {
        this.foodPreferences = foodPreferences;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Registration(Integer id, String name, String email, String password, String contact, String location,
            String foodPreferences, String role) {
        super();
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.contact = contact;
        this.location = location;
        this.foodPreferences = foodPreferences;
        this.role = role;
    }

    public Registration() {
        super();
    }

    @Override
    public String toString() {
        return "Registration [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password
                + ", contact=" + contact + ", location=" + location + ", foodPreferences=" + foodPreferences + ", role="
                + role + "]";
    }

	public Registration orElseThrow(Object object) {
		// TODO Auto-generated method stub
		return null;
	}
}
