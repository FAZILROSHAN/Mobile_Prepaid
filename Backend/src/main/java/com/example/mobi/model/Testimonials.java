package com.example.mobi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "testimonials")
public class Testimonials {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer testimonialId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String review;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
