package com.example.mobi.repository;

import com.example.mobi.model.Testimonials;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestimonialsRepository extends JpaRepository<Testimonials, Integer> {
    List<Testimonials> findByUser_UserId(Integer userId);
}
