package com.example.mobi.repository;

import com.example.mobi.model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RolesRepository extends JpaRepository<Roles, Integer> {
    Optional<Roles> findByRoleName(String roleName);
}
