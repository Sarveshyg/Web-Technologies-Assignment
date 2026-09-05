package com.vit.result.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

// Helper class for all result calculations.
// Kept separate so it is easy to unit test.
public class GradeCalculator {

    public static final BigDecimal MSE_MAX = new BigDecimal("30");
    public static final BigDecimal ESE_MAX = new BigDecimal("70");
    public static final BigDecimal PASS_MARKS = new BigDecimal("40");

    private GradeCalculator() {
        // utility class, no instances
    }

    // MSE is out of 30 and contributes 30 marks.
    // MSE Contribution = (MSE / 30) x 30 = MSE itself, but calculated explicitly.
    public static BigDecimal mseContribution(BigDecimal mseMarks) {
        validateMse(mseMarks);
        // (mse / 30) * 30, rounded to 2 decimals
        BigDecimal contribution = mseMarks
                .divide(MSE_MAX, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("30"));
        return round2(contribution);
    }

    // ESE is out of 70 and contributes 70 marks.
    // ESE Contribution = (ESE / 70) x 70 = ESE itself, but calculated explicitly.
    public static BigDecimal eseContribution(BigDecimal eseMarks) {
        validateEse(eseMarks);
        BigDecimal contribution = eseMarks
                .divide(ESE_MAX, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("70"));
        return round2(contribution);
    }

    // Final Marks = (MSE x 0.30) + (ESE x 0.70), scaled to 100.
    // Since MSE is out of 30 and ESE out of 70, this equals MSE + ESE.
    // Implemented explicitly as MSE contribution + ESE contribution.
    public static BigDecimal finalMarks(BigDecimal mseMarks, BigDecimal eseMarks) {
        BigDecimal msePart = mseContribution(mseMarks);
        BigDecimal esePart = eseContribution(eseMarks);
        return round2(msePart.add(esePart));
    }

    // Simple grading system.
    public static String grade(BigDecimal finalMarks) {
        double marks = finalMarks.doubleValue();
        if (marks >= 90) {
            return "O";
        } else if (marks >= 80) {
            return "A+";
        } else if (marks >= 70) {
            return "A";
        } else if (marks >= 60) {
            return "B+";
        } else if (marks >= 50) {
            return "B";
        } else if (marks >= 40) {
            return "C";
        } else {
            return "F";
        }
    }

    // Student passes only if every subject is >= 40.
    public static boolean isPass(BigDecimal finalMarks) {
        return finalMarks.compareTo(PASS_MARKS) >= 0;
    }

    public static void validateMse(BigDecimal mseMarks) {
        if (mseMarks == null) {
            throw new IllegalArgumentException("MSE marks cannot be empty");
        }
        if (mseMarks.compareTo(BigDecimal.ZERO) < 0
                || mseMarks.compareTo(MSE_MAX) > 0) {
            throw new IllegalArgumentException("MSE marks must be between 0 and 30");
        }
    }

    public static void validateEse(BigDecimal eseMarks) {
        if (eseMarks == null) {
            throw new IllegalArgumentException("ESE marks cannot be empty");
        }
        if (eseMarks.compareTo(BigDecimal.ZERO) < 0
                || eseMarks.compareTo(ESE_MAX) > 0) {
            throw new IllegalArgumentException("ESE marks must be between 0 and 70");
        }
    }

    // Round to 2 decimal places for display.
    public static BigDecimal round2(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}
