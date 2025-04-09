package com.example.mobi.repository;

import com.example.mobi.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByPhoneNumber(String phoneNumber);

    Optional<Users> findByEmail(String email);

    @Query("SELECT u FROM Users u WHERE u.role.roleName IN ('PRE_REGISTERED', 'NEW_USER')")
    List<Users> findAllNonAdminUsers();

    @Query("SELECT u FROM Users u WHERE u.role.roleName IN ('PRE_REGISTERED', 'NEW_USER') AND u.status = 'ACTIVE'")
    List<Users> findActiveNonAdminUsers();
}
