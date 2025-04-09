package com.example.mobi.repository;

import com.example.mobi.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByPhoneNumber(String phoneNumber);
    void deleteByPhoneNumber(String phoneNumber);
}
