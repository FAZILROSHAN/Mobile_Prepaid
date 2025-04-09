package com.example.mobi.controller;

import com.example.mobi.model.Users;
import com.example.mobi.service.UsersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/users")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> users = usersService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/non-admin")
    public ResponseEntity<List<Users>> getAllNonAdminUsers() {
        List<Users> users = usersService.findAllNonAdminUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/non-admin/active")
    public ResponseEntity<List<Users>> getActiveNonAdminUsers() {
        List<Users> users = usersService.findActiveNonAdminUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or #principal.name == usersService.getUserById(userId).get().phoneNumber")
    @GetMapping("/{userId}")
    public ResponseEntity<Users> getUserById(@PathVariable Integer userId, Principal principal) {
        Optional<Users> user = usersService.getUserById(userId);
        return user.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("#principal.name == usersService.getUserById(userId).get().phoneNumber")
    @PutMapping("/{userId}")
    public ResponseEntity<Users> updateUser(@PathVariable Integer userId, @RequestBody Users user, Principal principal) {
        Users updatedUser = usersService.updateUser(userId, user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer userId) {
        boolean isDeleted = usersService.deleteUser(userId);
        if (isDeleted) {
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User deletion failed");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/approve-kyc")
    public ResponseEntity<String> approveUserKYC(@PathVariable Integer userId) {
        boolean isApproved = usersService.approveUserKYC(userId);
        if (isApproved) {
            return ResponseEntity.ok("User KYC Approved");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User KYC Approval Failed");
    }

    @GetMapping("/{phoneNumber}/check")
    public ResponseEntity<?> checkUser(@PathVariable String phoneNumber) {
        Optional<Users> user = usersService.getByPhoneNumber(phoneNumber);
        if (user.isPresent() && user.get().getStatus() == Users.Status.ACTIVE) {
            return ResponseEntity.ok(Map.of("isRegistered", true));
        }
        return ResponseEntity.ok(Map.of("isRegistered", false));
    }

    @GetMapping("/validate/{phoneNumber}")
    public ResponseEntity<?> validateUser(@PathVariable String phoneNumber) {
        Optional<Users> userOptional = usersService.getByPhoneNumber(phoneNumber);

        if (userOptional.isPresent() && userOptional.get().getStatus() == Users.Status.ACTIVE) {
            Users user = userOptional.get();
            return ResponseEntity.ok(Map.of(
                "userId", user.getUserId(),
                "username", user.getUsername()
            ));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is not eligible");
    }
}
