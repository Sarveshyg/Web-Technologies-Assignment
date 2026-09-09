package com.bookstore.config;

import com.bookstore.entity.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedBooks(BookRepository bookRepository) {
        return args -> {
            // Insert sample books only when the collection is empty (no duplicates on restart).
            if (bookRepository.count() > 0) {
                return;
            }
            List<Book> books = List.of(
                    new Book("Clean Code", "Robert C. Martin", "Programming", 499.00,
                            "A handbook of agile software craftsmanship with practical advice on writing readable, maintainable code."),
                    new Book("The Pragmatic Programmer", "David Thomas, Andrew Hunt", "Programming", 599.00,
                            "Classic guide to pragmatic software development, careers, and craftsmanship."),
                    new Book("Designing Data-Intensive Applications", "Martin Kleppmann", "Database", 799.00,
                            "The architecture of modern databases, streaming systems, and distributed data processing."),
                    new Book("Learning SQL", "Alan Beaulieu", "Database", 449.00,
                            "A beginner-friendly introduction to SQL queries, joins, and database design."),
                    new Book("Eloquent JavaScript", "Marijn Haverbeke", "Web Development", 399.00,
                            "A modern introduction to programming with JavaScript for web development."),
                    new Book("You Don't Know JS", "Kyle Simpson", "Web Development", 549.00,
                            "Deep dive into JavaScript scopes, closures, prototypes, and async patterns."),
                    new Book("Introduction to Algorithms", "Cormen, Leiserson, Rivest, Stein", "Computer Science", 899.00,
                            "The standard textbook covering algorithms, data structures, and complexity analysis."),
                    new Book("The Alchemist", "Paulo Coelho", "Fiction", 299.00,
                            "A fable about following your dream — Santiago's journey across the desert."),
                    new Book("Atomic Habits", "James Clear", "Self Help", 349.00,
                            "Tiny changes, remarkable results — a proven framework for building good habits."),
                    new Book("The Lean Startup", "Eric Ries", "Business", 499.00,
                            "How startups can shorten product cycles and build what customers actually want."),
                    new Book("A Brief History of Time", "Stephen Hawking", "Science", 399.00,
                            "From the Big Bang to black holes — cosmology explained for everyone."),
                    new Book("Dune", "Frank Herbert", "Fiction", 599.00,
                            "Epic science fiction saga of politics, religion, and giant sandworms on Arrakis.")
            );
            bookRepository.saveAll(books);
        };
    }
}
