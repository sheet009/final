package com.marian.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.project.model.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    // Custom query methods can be added here if necessary
}
