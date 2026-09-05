package com.vit.result.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// One row per student submission (one semester result).
@Entity
@Table(name = "student_result")
public class StudentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String studentName;

    @Column(nullable = false, length = 30)
    private String prn;

    @Column(nullable = false)
    private Integer semester;

    // Total out of 400
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal totalMarks;

    // Percentage out of 100
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage;

    // PASS or FAIL
    @Column(nullable = false, length = 10)
    private String resultStatus;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "studentResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubjectResult> subjects = new ArrayList<>();

    public StudentResult() {
    }

    // --- getters and setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getPrn() {
        return prn;
    }

    public void setPrn(String prn) {
        this.prn = prn;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public BigDecimal getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(BigDecimal totalMarks) {
        this.totalMarks = totalMarks;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<SubjectResult> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectResult> subjects) {
        this.subjects = subjects;
    }

    // Helper to keep both sides of the relationship in sync.
    public void addSubject(SubjectResult subject) {
        subjects.add(subject);
        subject.setStudentResult(this);
    }
}
