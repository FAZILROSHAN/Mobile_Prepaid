package com.example.mobi.repository;

import com.example.mobi.model.KYCDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KycDetailsRepository extends JpaRepository<KYCDetails, Integer> {
    Optional<KYCDetails> findByUser_UserId(Integer userId);
}
