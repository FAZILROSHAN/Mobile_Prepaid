package com.example.mobi.service;

import com.example.mobi.model.ContactUs;
import java.util.List;
import java.util.Optional;

public interface ContactUsService {
    List<ContactUs> getAllContacts();
    Optional<ContactUs> getContactById(Integer id);
    ContactUs createContact(ContactUs contactUs);
}
