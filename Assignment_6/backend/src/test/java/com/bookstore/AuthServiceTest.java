package com.bookstore;

import com.bookstore.dto.LoginRequest;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.entity.User;
import com.bookstore.repository.UserRepository;
import com.bookstore.security.JwtService;
import com.bookstore.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    private RegisterRequest registerRequest() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("John Doe");
        req.setEmail("john@example.com");
        req.setPassword("password123");
        return req;
    }

    @Test
    void successfulRegistration_hashesPassword() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        authService.register(registerRequest());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals("john@example.com", saved.getEmail());
        // Password must be BCrypt hashed, never plaintext
        assertNotEquals("password123", saved.getPassword());
        assertTrue(saved.getPassword().startsWith("$2a$") || saved.getPassword().startsWith("$2b$"));
        assertTrue(passwordEncoder.matches("password123", saved.getPassword()));
    }

    @Test
    void duplicateEmail_rejected() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.register(registerRequest()));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        verify(userRepository, never()).save(any());
    }

    @Test
    void successfulLogin_returnsJwt() {
        User user = new User("John Doe", "john@example.com", passwordEncoder.encode("password123"));
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken("john@example.com")).thenReturn("test-jwt-token");

        LoginRequest login = new LoginRequest();
        login.setEmail("john@example.com");
        login.setPassword("password123");

        var response = authService.login(login);
        assertEquals("test-jwt-token", response.getToken());
        assertEquals("john@example.com", response.getEmail());
        assertEquals("John Doe", response.getFullName());
    }

    @Test
    void invalidPassword_rejected() {
        User user = new User("John Doe", "john@example.com", passwordEncoder.encode("password123"));
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        LoginRequest login = new LoginRequest();
        login.setEmail("john@example.com");
        login.setPassword("wrongpassword");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.login(login));
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    void unknownEmail_rejected() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        LoginRequest login = new LoginRequest();
        login.setEmail("nobody@example.com");
        login.setPassword("password123");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> authService.login(login));
        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatusCode());
    }
}
