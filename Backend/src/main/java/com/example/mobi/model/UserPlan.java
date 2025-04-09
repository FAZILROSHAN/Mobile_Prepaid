package com.example.mobi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "user_plans")
public class UserPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer planUsageId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private RechargePlans plan;

    @Column(nullable = false, updatable = false)
    private LocalDateTime activatedAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    @Column
    private Status status = Status.NULL;

    public enum Status {
        ACTIVE, EXPIRED,NULL
    }
}
