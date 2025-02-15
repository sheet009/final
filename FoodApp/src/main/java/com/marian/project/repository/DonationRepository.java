package com.marian.project.repository;

import com.marian.project.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    @Query("SELECT d FROM Donation d WHERE LOWER(d.email) = LOWER(:email)")
    List<Donation> findByEmail(@Param("email") String email);
    
    List<Donation> findByStatus(String status);
}