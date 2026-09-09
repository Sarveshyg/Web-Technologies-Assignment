package com.bookstore;

import com.bookstore.controller.BookController;
import com.bookstore.entity.Book;
import com.bookstore.security.CustomUserDetailsService;
import com.bookstore.security.JwtAuthenticationFilter;
import com.bookstore.security.JwtService;
import com.bookstore.security.SecurityConfig;
import com.bookstore.service.AuthService;
import com.bookstore.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
@Import({ SecurityConfig.class, JwtAuthenticationFilter.class })
class BookSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Test
    void protectedEndpoint_rejectsUnauthenticatedRequest() throws Exception {
        mockMvc.perform(get("/api/books"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidJwt_rejected() throws Exception {
        mockMvc.perform(get("/api/books")
                        .header("Authorization", "Bearer invalid.token.here"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void bookRetrieval_works() {
        // Plain service-level check via mock
        Book book = new Book("Clean Code", "Robert C. Martin", "Programming", 499.0, "About clean code");
        book.setId("1");
        when(bookService.findAll()).thenReturn(List.of(book));
        assertEquals(1, bookService.findAll().size());
        assertEquals("Clean Code", bookService.findAll().get(0).getTitle());
    }

    @Test
    void authenticatedBookRetrieval_returnsBooks() throws Exception {
        // Simulate a valid JWT
        var userDetails = new org.springframework.security.core.userdetails.User(
                "john@example.com", "hashed", List.of());
        when(userDetailsService.loadUserByUsername("john@example.com")).thenReturn(userDetails);
        when(jwtService.extractUsername("valid-token")).thenReturn("john@example.com");
        when(jwtService.isTokenValid("valid-token", userDetails)).thenReturn(true);

        Book book = new Book("Clean Code", "Robert C. Martin", "Programming", 499.0, "About clean code");
        book.setId("1");
        when(bookService.findAll()).thenReturn(List.of(book));

        mockMvc.perform(get("/api/books")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Clean Code"));
    }
}
