package com.icesi.PhotoMarketApplication.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        
        userDetails = User.builder()
                .username("testuser")
                .password("password")
                .authorities(
                    new SimpleGrantedAuthority("ROLE_USER"),
                    new SimpleGrantedAuthority("READ")
                )
                .build();
    }

    @Test
    void testGenerateToken() {
        String token = jwtService.generateToken(userDetails);
        
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testExtractUsername() {
        String token = jwtService.generateToken(userDetails);
        String username = jwtService.extractUsername(token);
        
        assertEquals("testuser", username);
    }

    @Test
    void testExtractRoles() {
        String token = jwtService.generateToken(userDetails);
        List<String> roles = jwtService.extractRoles(token);
        
        assertNotNull(roles);
        assertEquals(2, roles.size());
        assertTrue(roles.contains("ROLE_USER"));
        assertTrue(roles.contains("READ"));
    }

    @Test
    void testValidateToken_Valid() {
        String token = jwtService.generateToken(userDetails);
        Boolean isValid = jwtService.validateToken(token, userDetails);
        
        assertTrue(isValid);
    }

    @Test
    void testValidateToken_WrongUsername() {
        String token = jwtService.generateToken(userDetails);
        
        UserDetails wrongUser = User.builder()
                .username("wronguser")
                .password("password")
                .authorities(new SimpleGrantedAuthority("ROLE_USER"))
                .build();
        
        Boolean isValid = jwtService.validateToken(token, wrongUser);
        
        assertFalse(isValid);
    }

    @Test
    void testIsTokenExpired() {
        String token = jwtService.generateToken(userDetails);
        Boolean isExpired = jwtService.isTokenExpired(token);
        
        assertFalse(isExpired);
    }

    @Test
    void testGetExpirationTime() {
        Long expirationTime = jwtService.getExpirationTime();
        
        assertEquals(86400000L, expirationTime); // 24 horas
    }
}