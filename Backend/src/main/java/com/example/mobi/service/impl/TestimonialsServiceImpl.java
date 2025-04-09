package com.example.mobi.service.impl;

import com.example.mobi.model.Testimonials;
import com.example.mobi.repository.TestimonialsRepository;
import com.example.mobi.service.TestimonialsService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TestimonialsServiceImpl implements TestimonialsService {

    private final TestimonialsRepository testimonialsRepository;

    public TestimonialsServiceImpl(TestimonialsRepository testimonialsRepository) {
        this.testimonialsRepository = testimonialsRepository;
    }

    @Override
    public List<Testimonials> getAllTestimonials() {
        return testimonialsRepository.findAll();
    }

    @Override
    public Optional<Testimonials> getTestimonialById(Integer id) {
        return testimonialsRepository.findById(id);
    }

    @Override
    public Testimonials createTestimonial(Testimonials testimonial) {
        return testimonialsRepository.save(testimonial);
    }
}
