package com.example.mobi.service.impl;

import com.example.mobi.model.FAQ;
import com.example.mobi.repository.FaqRepository;
import com.example.mobi.service.FAQService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FAQServiceImpl implements FAQService {

    private final FaqRepository faqRepository;

    public FAQServiceImpl(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    @Override
    public List<FAQ> getAllFAQs() {
        return faqRepository.findAll();
    }

    @Override
    public Optional<FAQ> getFAQById(Integer id) {
        return faqRepository.findById(id);
    }

    @Override
    public FAQ createFAQ(FAQ faq) {
        return faqRepository.save(faq);
    }
}
