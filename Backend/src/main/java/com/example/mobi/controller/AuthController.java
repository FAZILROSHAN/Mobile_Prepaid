package com.example.mobi.controller;

import com.example.mobi.model.Roles;
import com.example.mobi.model.Users;
import com.example.mobi.repository.RolesRepository;
import com.example.mobi.repository.UsersRepository;
import com.example.mobi.security.JwtUtil;
import com.example.mobi.service.OtpService;
import com.example.mobi.service.TwilioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsersRepository usersRepository;
    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final TwilioService twilioService;

    @Autowired
    public AuthController(
            AuthenticationManager authenticationManager, 
            JwtUtil jwtUtil, 
            UsersRepository usersRepository, 
            PasswordEncoder passwordEncoder, 
            OtpService otpService, 
            RolesRepository rolesRepository, 
            TwilioService twilioService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.rolesRepository = rolesRepository;
        this.otpService = otpService;
        this.twilioService = twilioService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number is required"));
        }

        String formattedPhone = otpService.formatPhoneNumber(phoneNumber);

       
        Optional<Users> user = usersRepository.findByPhoneNumber(formattedPhone);
        if (user.isEmpty()) {
            user = usersRepository.findByPhoneNumber(phoneNumber); 
        }

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        try {
            String otp = otpService.generateOtp(formattedPhone);
            twilioService.sendSMS(formattedPhone, "Your OTP is: " + otp);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send OTP: " + e.getMessage()));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        String otp = request.get("otp");

        if (phoneNumber == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number and OTP are required"));
        }

        Users user = usersRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().getRoleId() != 2) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only pre-registered users can log in with OTP"));
        }

        if (!otpService.validateOtp(phoneNumber, otp)) {
            throw new BadCredentialsException("Invalid OTP");
        }

        String token = jwtUtil.generateToken(user.getPhoneNumber(), user.getRole().getRoleName());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", user.getUsername(), 
            "userId", String.valueOf(user.getUserId())
        ));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Users admin = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole().getRoleId() != 1) {
            throw new RuntimeException("This user is not an admin.");
        }

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(admin.getEmail(), admin.getRole().getRoleName());
        return ResponseEntity.ok(Map.of("token", token));
    }

   @PostMapping("/register")
   public ResponseEntity<?> register(@RequestBody Users user) {
      if (user.getPhoneNumber() == null || user.getPassword() == null) {
          return ResponseEntity.badRequest().body("Phone number and password are required.");
       }

       if (usersRepository.findByPhoneNumber(user.getPhoneNumber()).isPresent()) {
          return ResponseEntity.badRequest().body("User with this phone number already exists.");
      }
      if (user.getRole() == null || user.getRole().getRoleId() == null) {
            return ResponseEntity.badRequest().body("Role ID is required.");
        }

        Roles role = rolesRepository.findById(user.getRole().getRoleId())
                .orElse(null);

        if (role == null) {
            return ResponseEntity.badRequest().body("Invalid Role ID. Role not found.");
        }

        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(Users.Status.PENDING);

        Users savedUser = usersRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
