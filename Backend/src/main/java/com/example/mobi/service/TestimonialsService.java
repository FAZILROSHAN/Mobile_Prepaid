package com.example.mobi.service;

import com.example.mobi.model.Testimonials;
import java.util.List;
import java.util.Optional;

public interface TestimonialsService {
    List<Testimonials> getAllTestimonials();
    Optional<Testimonials> getTestimonialById(Integer id);
    Testimonials createTestimonial(Testimonials testimonial);
}
