package com.example.mobi.repository;

import com.example.mobi.model.Payments;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentsRepository extends JpaRepository<Payments, Integer> {
    Optional<Payments> findByReferenceId(String referenceId);
}
