package com.vit.result.repository;

import com.vit.result.entity.StudentResult;
import org.springframework.data.jpa.repository.JpaRepository;

// Basic CRUD + findAll ordered by latest first.
public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {
}
