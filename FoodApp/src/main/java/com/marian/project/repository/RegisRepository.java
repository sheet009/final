package com.marian.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.project.model.Registration;

@Repository
public interface RegisRepository extends JpaRepository<Registration, Integer> {
    Registration findByEmail(String email);
    boolean existsByEmail(String email);

    // Custom query to count users by role
    long countByRole(String role);
}
