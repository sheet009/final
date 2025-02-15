package com.marian.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.project.model.Contact;
import com.marian.project.repository.ContactRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    // Get all contact messages
    public List<Contact> getAllMessages() {
        return contactRepository.findAll();
    }

    // Save new contact message
    public Contact createContactMessage(Contact contactMessage) {
        return contactRepository.save(contactMessage);
    }

    // Respond to a contact message
    public boolean respondToMessage(Long id, String response) {
        Optional<Contact> message = contactRepository.findById(id);
        if (message.isPresent()) {
            Contact contactMessage = message.get();
            contactMessage.setResponse(response);
            contactRepository.save(contactMessage); // Save response
            return true;
        }
        return false;
    }

    // Optional: Delete a message (if required)
    public void deleteContactMessage(Long id) {
        contactRepository.deleteById(id);
    }

    // Add method to get a contact message by its ID
    public Optional<Contact> getMessageById(Long id) {
        return contactRepository.findById(id);
    }
}
