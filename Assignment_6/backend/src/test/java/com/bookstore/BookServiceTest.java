package com.bookstore;

import com.bookstore.entity.Book;
import com.bookstore.repository.BookRepository;
import com.bookstore.service.BookService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    @Test
    void findAll_returnsBooks() {
        Book book = new Book("Dune", "Frank Herbert", "Fiction", 599.0, "Epic sci-fi");
        when(bookRepository.findAll()).thenReturn(List.of(book));
        assertEquals(1, bookService.findAll().size());
    }

    @Test
    void findById_missingBook_returns404() {
        when(bookRepository.findById("missing")).thenReturn(Optional.empty());
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> bookService.findById("missing"));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }
}
