package com.example.mobi.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${spring.security.jwt.secret}")
    private String secretKey;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String identifier, String role) {
        return Jwts.builder()
                .claim("role", role)
                .subject(identifier)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(getSigningKey(), Jwts.SIG.HS256) // ✅ Ensure correct signing method
                .compact();
    }




    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String phoneNumber = extractUsername(token);
        return (phoneNumber.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getBody();
    }
}