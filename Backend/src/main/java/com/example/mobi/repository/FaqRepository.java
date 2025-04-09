package com.example.mobi.repository;

import com.example.mobi.model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqRepository extends JpaRepository<FAQ, Integer> {
}
