package com.example.mobi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Roles role;

    @Column(nullable = false)
    private String username;

    @Column(unique = true,nullable = true)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(unique = true, nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING, ACTIVE, INACTIVE, REJECTED
    }
}
