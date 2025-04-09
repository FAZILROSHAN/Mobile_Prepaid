package com.example.mobi.security;

import com.example.mobi.model.Users;
import com.example.mobi.repository.UsersRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    public CustomUserDetailsService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Users user;

        if (identifier.contains("@")) {
            //  Admin login using email
            user = usersRepository.findByEmail(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

            if (user.getRole().getRoleId() != 1) {
                throw new UsernameNotFoundException("This user is not an admin.");
            }

        } else {
            // ✅ Pre-registered user login using phone number
            user = usersRepository.findByPhoneNumber(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (user.getRole().getRoleId() != 2) {
                throw new UsernameNotFoundException("This user is not a pre-registered user.");
            }
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(identifier)
                .password(user.getPassword() != null ? user.getPassword() : "")
                .roles(user.getRole().getRoleName())
                .build();
    }

}
