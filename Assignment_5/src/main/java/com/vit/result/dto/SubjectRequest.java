package com.vit.result.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

// Form backing object for one subject row.
public class SubjectRequest {

    @NotBlank(message = "Subject name is required")
    @Size(max = 100, message = "Subject name must be under 100 characters")
    private String subjectName;

    @NotNull(message = "MSE marks are required")
    @DecimalMin(value = "0", message = "MSE must be between 0 and 30")
    @DecimalMax(value = "30", message = "MSE must be between 0 and 30")
    private BigDecimal mseMarks;

    @NotNull(message = "ESE marks are required")
    @DecimalMin(value = "0", message = "ESE must be between 0 and 70")
    @DecimalMax(value = "70", message = "ESE must be between 0 and 70")
    private BigDecimal eseMarks;

    public SubjectRequest() {
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
}
