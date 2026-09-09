# Online Book Store — BookNest

## Description

BookNest is a responsive full-stack online book store built as a college assignment.
It has a public home page, registration and login pages, and a protected book
catalogue that requires JWT authentication. Passwords are hashed with BCrypt and
stored in MongoDB — plaintext passwords are never stored, logged, or returned by
any API.

## Features

- Responsive home page with hero section, featured books, navbar, and footer
- User registration with validation (name, email, password min 6 chars, confirm match)
- Login with BCrypt verification and JWT issuance
- Protected catalogue: search by title/author, category filter, responsive cards
- Spring Security + JWT filter protecting `GET /api/books` endpoints
- 12 sample books seeded only when the books collection is empty
- Backend unit + security tests (`mvn test` passes)

## Technology Stack

- Frontend: React, TypeScript, Vite, React Router, Bootstrap 5, Fetch API
- Backend: Java 17, Spring Boot 3, Spring Web, Spring Data MongoDB, Spring Security, JJWT, BCrypt
- Database: MongoDB (`bookstore_db`, collections `users` and `books`)
- Build: Maven, npm

## Project Structure

```text
Assignment_6/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/   # Navbar, Footer, ProtectedRoute
│       ├── pages/        # HomePage, LoginPage, RegisterPage, CataloguePage
│       ├── services/     # api.ts, authService.ts, bookService.ts
│       ├── types/        # User, AuthResponse, Book
│       ├── App.tsx
│       └── main.tsx
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/bookstore/
│       │   ├── BookstoreApplication.java
│       │   ├── controller/  # AuthController, BookController
│       │   ├── service/     # AuthService, BookService
│       │   ├── entity/      # User, Book
│       │   ├── repository/  # UserRepository, BookRepository
│       │   ├── dto/         # RegisterRequest, LoginRequest, AuthResponse
│       │   ├── security/    # SecurityConfig, JwtAuthenticationFilter, JwtService, CustomUserDetailsService
│       │   └── config/      # DataInitializer
│       ├── main/resources/application.properties
│       └── test/java/com/bookstore/  # AuthServiceTest, JwtServiceTest, BookSecurityTest, BookServiceTest
└── README.md
```

## MongoDB Setup

1. Install and start MongoDB locally.
2. The app connects to:

```text
mongodb://localhost:27017/bookstore_db
```

3. Collections (`users`, `books`) are created automatically. Sample books are
   seeded on first startup when `books` is empty.

## Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Backend: http://localhost:8080

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Authentication

Registration flow:

```text
React form → POST /api/auth/register → validate → check duplicate email
→ BCrypt hash password → save to MongoDB → 201 Created
```

Login flow:

```text
React form → POST /api/auth/login → find user by email
→ BCrypt matches() verification → generate JWT → return { token, email, fullName }
→ React stores JWT + user info (never the password) → navigate to /catalogue
```

Protected API request flow:

```text
React (Authorization: Bearer <JWT>) → JwtAuthenticationFilter validates
signature + expiration → Spring Security sets authentication → BookController
→ 200 OK with books (401 if JWT missing/invalid/expired)
```

## JWT Configuration

The JWT secret is read from the environment with a development-only fallback:

```properties
jwt.secret=${JWT_SECRET:change-this-development-secret-key-please-override-via-env}
jwt.expiration=3600000
```

Set a real secret locally (PowerShell):

```powershell
$env:JWT_SECRET="a-long-random-base64-secret-at-least-32-bytes"
```

or on Linux/macOS:

```bash
export JWT_SECRET="a-long-random-base64-secret-at-least-32-bytes"
```

Never commit a real production secret. Use a long random value and HTTPS in
production. Tokens expire after 1 hour.

## API Summary

| Method | Endpoint             | Auth | Success |
|--------|----------------------|------|---------|
| POST   | `/api/auth/register` | No   | 201 Created, 400 invalid data, 409 duplicate email |
| POST   | `/api/auth/login`    | No   | 200 OK with JWT, 401 invalid credentials |
| GET    | `/api/books`         | JWT  | 200 OK, 401 missing/invalid JWT |
| GET    | `/api/books/{id}`    | JWT  | 200 OK, 401 unauthenticated, 404 not found |

## Security

- Passwords are hashed with `BCryptPasswordEncoder` before saving; login uses
  `matches()` — plaintext is never stored, logged, or returned.
- JWT provides stateless authentication (subject = email, issued-at, expiration);
  signature and expiration are validated on every protected request.
- `/api/auth/register` and `/api/auth/login` are public; `/api/books/**`
  requires authentication; an entry point returns 401 for unauthenticated calls.
- CORS allows only `http://localhost:5173` with `GET, POST` and the
  `Authorization` / `Content-Type` headers.
- `localStorage` holds only the JWT + basic user info for simplicity because
  this is a simplified academic project. Production applications should consider
  HttpOnly Secure cookies, HTTPS, refresh-token rotation, and stronger controls.
- No credentials or real secrets are committed to the repository.
