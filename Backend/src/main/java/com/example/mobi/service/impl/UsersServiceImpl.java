package com.example.mobi.service.impl;

import com.example.mobi.model.Users;
import com.example.mobi.repository.UsersRepository;
import com.example.mobi.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;

    @Autowired
    public UsersServiceImpl(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    @Override
    public Optional<Users> getUserById(Integer userId) {
        return usersRepository.findById(userId);
    }

    @Override
    public Users createUser(Users user) {
        if (user.getRole().getRoleId() == 1) {
            user.setStatus(Users.Status.ACTIVE);
        } else {
            user.setStatus(Users.Status.PENDING);
        }
        return usersRepository.save(user);
    }

    @Override
    public Users updateUser(Integer userId, Users user) {
        Users existingUser = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setStatus(user.getStatus());

        return usersRepository.save(existingUser);
    }

    @Override
    public boolean deleteUser(Integer userId) {
        Optional<Users> userOptional = usersRepository.findById(userId);

        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            if (user.getRole().getRoleId() == 1) {
                throw new RuntimeException("Admins cannot be deleted!");
            }
            usersRepository.deleteById(userId);
            return true;
        }

        return false;
    }

    @Override
    public boolean approveUserKYC(Integer userId) {
        Optional<Users> userOptional = usersRepository.findById(userId);

        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            if (user.getStatus() == Users.Status.PENDING) {
                user.setStatus(Users.Status.ACTIVE);
                usersRepository.save(user);
                return true;
            }
        }

        return false;
    }

    @Override
    public Optional<Users> getByPhoneNumber(String phoneNumber) {
        return usersRepository.findByPhoneNumber(phoneNumber);
    }

    @Override
    public Optional<Users> getByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    @Override
    public boolean isUserEligibleForRecharge(String phoneNumber) {
        Optional<Users> user = usersRepository.findByPhoneNumber(phoneNumber);
        return user.isPresent() && user.get().getStatus() == Users.Status.ACTIVE;
    }

    @Override
    public List<Users> findAllNonAdminUsers() {
        return usersRepository.findAllNonAdminUsers();
    }

    @Override
    public List<Users> findActiveNonAdminUsers() {
        return usersRepository.findActiveNonAdminUsers();
    }
}
