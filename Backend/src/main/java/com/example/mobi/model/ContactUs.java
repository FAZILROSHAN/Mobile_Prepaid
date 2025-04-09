package com.example.mobi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "contact_us")
public class ContactUs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contactId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
