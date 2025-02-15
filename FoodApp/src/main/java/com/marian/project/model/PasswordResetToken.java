package com.marian.project.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class PasswordResetToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Registration register;

    private LocalDateTime expiryDate;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, Registration register, LocalDateTime expiryDate) {
        this.token = token;
        this.register = register;
        this.expiryDate = expiryDate;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}


	public LocalDateTime getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDateTime expiryDate) {
		this.expiryDate = expiryDate;
	}

	public Registration getRegister() {
		return register;
	}

	public void setRegister(Registration register) {
		this.register = register;
	}

	@Override
	public String toString() {
		return "PasswordResetToken [id=" + id + ", token=" + token + ", register=" + register + ", expiryDate="
				+ expiryDate + "]";
	}

	
	
    // Getters and Setters
}