package com.marian.project.controller;

import com.marian.project.repository.DonationRepository;
import com.marian.project.repository.DonationRequestRepository;
import com.marian.project.repository.RegisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatisticsController {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private DonationRequestRepository donationRequestRepository;

    @Autowired
    private RegisRepository regisRepository;

    @GetMapping
    public ResponseEntity<Map<String, Long>> getStatistics() {
        Map<String, Long> stats = new HashMap<>();

        // Fetch the counts from the database
        long totalDonations = donationRepository.count();
        long totalRequests = donationRequestRepository.count();
        long totalDonors = regisRepository.countByRole("DONOR");
        long totalRecipients = regisRepository.countByRole("RECIPIENT");

        // Populate the statistics map
        stats.put("totalDonations", totalDonations);
        stats.put("totalRequests", totalRequests);
        stats.put("totalDonors", totalDonors);
        stats.put("totalRecipients", totalRecipients);

        return ResponseEntity.ok(stats);
    }
}
