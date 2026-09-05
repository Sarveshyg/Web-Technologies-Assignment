package com.vit.result.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

// One row per subject (exactly 4 per StudentResult).
@Entity
@Table(name = "subject_result")
public class SubjectResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String subjectName;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal mseMarks;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal eseMarks;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal finalMarks;

    @Column(nullable = false, length = 5)
    private String grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_result_id", nullable = false)
    private StudentResult studentResult;

    public SubjectResult() {
    }

    // --- getters and setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public BigDecimal getMseMarks() {
        return mseMarks;
    }

    public void setMseMarks(BigDecimal mseMarks) {
        this.mseMarks = mseMarks;
    }

    public BigDecimal getEseMarks() {
        return eseMarks;
    }

    public void setEseMarks(BigDecimal eseMarks) {
        this.eseMarks = eseMarks;
    }

    public BigDecimal getFinalMarks() {
        return finalMarks;
    }

    public void setFinalMarks(BigDecimal finalMarks) {
        this.finalMarks = finalMarks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public StudentResult getStudentResult() {
        return studentResult;
    }

    public void setStudentResult(StudentResult studentResult) {
        this.studentResult = studentResult;
    }
}
