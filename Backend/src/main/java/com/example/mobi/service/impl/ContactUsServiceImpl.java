package com.example.mobi.service.impl;

import com.example.mobi.model.ContactUs;
import com.example.mobi.repository.ContactUsRepository;
import com.example.mobi.service.ContactUsService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ContactUsServiceImpl implements ContactUsService {

    private final ContactUsRepository contactUsRepository;

    public ContactUsServiceImpl(ContactUsRepository contactUsRepository) {
        this.contactUsRepository = contactUsRepository;
    }

    @Override
    public List<ContactUs> getAllContacts() {
        return contactUsRepository.findAll();
    }

    @Override
    public Optional<ContactUs> getContactById(Integer id) {
        return contactUsRepository.findById(id);
    }

    @Override
    public ContactUs createContact(ContactUs contactUs) {
        return contactUsRepository.save(contactUs);
    }
}
