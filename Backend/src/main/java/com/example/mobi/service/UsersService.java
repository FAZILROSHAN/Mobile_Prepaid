package com.example.mobi.service;

import com.example.mobi.model.Users;
import java.util.List;
import java.util.Optional;

public interface UsersService {
    List<Users> getAllUsers();
    Optional<Users> getUserById(Integer userId);
    Users createUser(Users user);
    Users updateUser(Integer userId, Users user);
    boolean deleteUser(Integer userId);
    boolean approveUserKYC(Integer userId);
    Optional<Users> getByPhoneNumber(String phoneNumber);
    Optional<Users> getByEmail(String email);
    boolean isUserEligibleForRecharge(String phoneNumber);

    List<Users> findAllNonAdminUsers();
    List<Users> findActiveNonAdminUsers();
}
