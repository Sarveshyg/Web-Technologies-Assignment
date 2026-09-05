# VIT Semester Result Calculator

A simple, responsive Spring Boot web application to prepare one semester result for VIT Pune students.
A student enters details + marks for exactly **4 subjects** (MSE out of 30, ESE out of 70).
The app calculates weighted final marks, grades, total, percentage and PASS/FAIL status, and stores the result in MySQL.

## Features

- Result entry form: student name, PRN, semester + 4 subjects (name, MSE 0–30, ESE 0–70)
- Server-side validation with clear error messages
- Result calculation per subject + total / percentage / PASS-FAIL
- MySQL persistence with Spring Data JPA (Hibernate auto-creates tables)
- Previous Results page with View Result detail page
- Responsive Bootstrap 5 UI (desktop, tablet, mobile)
- Basic unit tests for calculation logic

## Technologies Used

- Java 17
- Spring Boot 3.2.5 (Spring MVC, Spring Data JPA, Validation)
- MySQL 8 + MySQL Connector/J
- Thymeleaf
- Bootstrap 5 (CDN)
- Maven
- JUnit 5

## Prerequisites

- JDK 17+
- Maven 3.8+
- MySQL 8 running on `localhost:3306`

## MySQL Setup

Create the database once (tables are created automatically by Hibernate):

```sql
CREATE DATABASE vit_result_db;
```

No manual table creation is needed (`spring.jpa.hibernate.ddl-auto=update`).

## How to Configure application.properties

File: `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vit_result_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

Replace `YOUR_PASSWORD` with your actual MySQL root password. Do not commit a real password.

## How to Run Using Maven

```bash
mvn spring-boot:run
```

Or build + run:

```bash
mvn clean package
java -jar target/vit-result-calculator-1.0.0.jar
```

Run tests:

```bash
mvn test
```

## Application URLs

- `http://localhost:8080/` → Result entry form
- `http://localhost:8080/results` → Previous results
- `http://localhost:8080/results/{id}` → Individual result (e.g. `/results/1`)

## Database Structure

**student_result**

| Column | Type | Notes |
|---|---|---|
| id | BIGINT (PK, auto) | |
| student_name | VARCHAR(100) | |
| prn | VARCHAR(30) | |
| semester | INT | 1–8 |
| total_marks | DECIMAL(6,2) | out of 400 |
| percentage | DECIMAL(5,2) | out of 100 |
| result_status | VARCHAR(10) | PASS / FAIL |
| created_at | DATETIME | |

**subject_result**

| Column | Type | Notes |
|---|---|---|
| id | BIGINT (PK, auto) | |
| subject_name | VARCHAR(100) | |
| mse_marks | DECIMAL(5,2) | 0–30 |
| ese_marks | DECIMAL(5,2) | 0–70 |
| final_marks | DECIMAL(5,2) | out of 100 |
| grade | VARCHAR(5) | O / A+ / A / B+ / B / C / F |
| student_result_id | BIGINT (FK) | → student_result.id |

One `StudentResult` has many `SubjectResult` rows (exactly 4 per submission).

## Calculation Formula

Per subject:

```
MSE Contribution = (MSE / 30) × 30
ESE Contribution = (ESE / 70) × 70
Final Marks = (MSE × 0.30) + (ESE × 0.70) = MSE Contribution + ESE Contribution  (out of 100)
```

Overall:

```
Total = sum of 4 final marks (out of 400)
Percentage = Total / 400 × 100
Result = FAIL if any subject final < 40, else PASS
```

Final marks and percentage are rounded to 2 decimal places (`BigDecimal`).

## Grading System

| Final Marks | Grade |
|---|---|
| 90–100 | O |
| 80–89 | A+ |
| 70–79 | A |
| 60–69 | B+ |
| 50–59 | B |
| 40–49 | C |
| Below 40 | F |

## Project Folder Structure

```
src/main/java/com/vit/result/
    VitResultCalculatorApplication.java
    controller/ResultController.java
    entity/StudentResult.java
    entity/SubjectResult.java
    repository/StudentResultRepository.java
    repository/SubjectResultRepository.java
    service/ResultService.java
    dto/ResultRequest.java
    dto/SubjectRequest.java
    util/GradeCalculator.java
src/main/resources/
    application.properties
    templates/index.html
    templates/result.html
    templates/history.html
    templates/error.html
src/test/java/com/vit/result/util/
    GradeCalculatorTest.java
pom.xml
README.md
```

## Sample Test Data

Student: `Aarav Sharma`, PRN: `2023BTECS00101`, Semester: `5`

| Subject | MSE (/30) | ESE (/70) | Final | Grade |
|---|---|---|---|---|
| Web Technology | 25 | 60 | 85.00 | A+ |
| DBMS | 22 | 55 | 77.00 | A |
| Operating Systems | 18 | 48 | 66.00 | B+ |
| Computer Networks | 12 | 35 | 47.00 | C |

Total: 275.00 / 400, Percentage: 68.75%, Result: PASS.

Fail example: any subject below 40 final (e.g. MSE 8 + ESE 25 = 33.00 → F) makes the overall result FAIL.
