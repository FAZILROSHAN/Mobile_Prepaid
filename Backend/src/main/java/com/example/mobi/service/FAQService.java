package com.example.mobi.service;

import com.example.mobi.model.FAQ;
import java.util.List;
import java.util.Optional;

public interface FAQService {
    List<FAQ> getAllFAQs();
    Optional<FAQ> getFAQById(Integer id);
    FAQ createFAQ(FAQ faq);
}
