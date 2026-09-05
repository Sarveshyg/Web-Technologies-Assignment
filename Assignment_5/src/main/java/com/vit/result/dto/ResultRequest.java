package com.vit.result.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

// Form backing object for the home page (student + 4 subjects).
public class ResultRequest {

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Student name must be 2-100 characters")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Student name should contain only letters and spaces")
    private String studentName;

    @NotBlank(message = "PRN is required")
    @Size(max = 30, message = "PRN must be under 30 characters")
    private String prn;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be between 1 and 8")
    @Max(value = 8, message = "Semester must be between 1 and 8")
    private Integer semester;

    // Exactly 4 subjects.
    @Size(min = 4, max = 4, message = "Exactly 4 subjects are required")
    @Valid
    private List<SubjectRequest> subjects = new ArrayList<>();

    public ResultRequest() {
        // Pre-fill 4 empty rows so the form always shows 4 subjects.
        for (int i = 0; i < 4; i++) {
            subjects.add(new SubjectRequest());
        }
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

    public List<SubjectRequest> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectRequest> subjects) {
        this.subjects = subjects;
    }
}
