package com.marian.project.service;


import com.marian.project.repository.RegisRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private RegisRepository regisRepository;  // Your repository for registration

    public Map<String, Long> getStatistics() {
        Map<String, Long> statistics = new HashMap<>();

        long totalDonors = regisRepository.countByRole("DONOR");  // Count donors
        long totalRecipients = regisRepository.countByRole("RECIPIENT");  // Count recipients
        long totalRequests = regisRepository.countByRole("REQUESTER");  // Count requesters
        long totalDonations = // Fetch the count of donations from Donation repository

        statistics.put("totalDonors", totalDonors);
        statistics.put("totalRecipients", totalRecipients);  // Add total recipients
        statistics.put("totalRequests", totalRequests);
        statistics.put("totalDonations", totalDonations);

        return statistics;
    }

}
