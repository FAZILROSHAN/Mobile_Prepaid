package com.example.mobi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "kyc_details")
public class KYCDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer kycId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;

    @Column(nullable = false)
    private String documentType;

    @Column(nullable = false, unique = true)
    private String documentNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column
    private LocalDateTime reviewedAt;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}

