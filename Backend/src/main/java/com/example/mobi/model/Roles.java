package com.example.mobi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "roles")
public class Roles {

    @Id
    private Integer roleId;

    @Column(nullable = false, unique = true)
    private String roleName;
}
