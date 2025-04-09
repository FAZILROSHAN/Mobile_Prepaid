package com.example.mobi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "faq")
public class FAQ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer faqId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;
}
