package com.bookstore;

import com.bookstore.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private final JwtService jwtService =
            new JwtService("test-secret-key-that-is-long-enough-for-hs256-algorithm-123456", 3600000);

    private User user(String email) {
        return new User(email, "hashed", Collections.emptyList());
    }

    @Test
    void jwtGenerated_onLogin_andValidates() {
        String token = jwtService.generateToken("john@example.com");
        assertNotNull(token);
        assertFalse(token.isBlank());
        assertEquals("john@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, user("john@example.com")));
    }

    @Test
    void invalidToken_rejected() {
        assertFalse(jwtService.isTokenValid("this.is.not.a.valid.token", user("john@example.com")));
    }

    @Test
    void tokenForDifferentUser_rejected() {
        String token = jwtService.generateToken("john@example.com");
        assertFalse(jwtService.isTokenValid(token, user("someone-else@example.com")));
    }

    @Test
    void expiredToken_rejected() throws InterruptedException {
        JwtService shortLived =
                new JwtService("test-secret-key-that-is-long-enough-for-hs256-algorithm-123456", 1);
        String token = shortLived.generateToken("john@example.com");
        Thread.sleep(20);
        assertFalse(shortLived.isTokenValid(token, user("john@example.com")));
    }
}
