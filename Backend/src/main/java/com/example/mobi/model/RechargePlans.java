package com.example.mobi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(name = "recharge_plans")
public class RechargePlans {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer planId;

    @Column(nullable = false)
    private String planName;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer validityDays;

    @Column(nullable = false)
    private String data; 

    @Column(nullable = false)
    private String benefits; 
    
    @Column(nullable = false)
    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Categories category; 
}