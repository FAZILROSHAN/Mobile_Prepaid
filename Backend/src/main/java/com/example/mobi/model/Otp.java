package com.example.mobi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    public Otp() {}

    public Otp(String phoneNumber, String otp, LocalDateTime expiresAt) {
        this.phoneNumber = phoneNumber;
        this.otp = otp;
        this.expiresAt = expiresAt;
    }

    public String getPhoneNumber() { return phoneNumber; }
    public String getOtp() { return otp; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
}
