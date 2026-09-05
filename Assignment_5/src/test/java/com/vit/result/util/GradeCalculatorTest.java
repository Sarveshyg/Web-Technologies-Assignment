package com.vit.result.util;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

// Basic unit tests for grade + marks + pass/fail logic.
class GradeCalculatorTest {

    private BigDecimal bd(String value) {
        return new BigDecimal(value);
    }

    @Test
    void highMarks_giveOGrade() {
        // MSE 28/30 + ESE 65/70 = 93
        BigDecimal finalMarks = GradeCalculator.finalMarks(bd("28"), bd("65"));
        assertEquals(0, bd("93.00").compareTo(finalMarks));
        assertEquals("O", GradeCalculator.grade(finalMarks));
        assertTrue(GradeCalculator.isPass(finalMarks));
    }

    @Test
    void averageMarks_giveBPlusGrade() {
        // MSE 20 + ESE 45 = 65
        BigDecimal finalMarks = GradeCalculator.finalMarks(bd("20"), bd("45"));
        assertEquals(0, bd("65.00").compareTo(finalMarks));
        assertEquals("B+", GradeCalculator.grade(finalMarks));
        assertTrue(GradeCalculator.isPass(finalMarks));
    }

    @Test
    void exactly40_isPassWithGradeC() {
        // MSE 10 + ESE 30 = 40
        BigDecimal finalMarks = GradeCalculator.finalMarks(bd("10"), bd("30"));
        assertEquals(0, bd("40.00").compareTo(finalMarks));
        assertEquals("C", GradeCalculator.grade(finalMarks));
        assertTrue(GradeCalculator.isPass(finalMarks));
    }

    @Test
    void below40_isFailWithGradeF() {
        // MSE 8 + ESE 25 = 33
        BigDecimal finalMarks = GradeCalculator.finalMarks(bd("8"), bd("25"));
        assertEquals(0, bd("33.00").compareTo(finalMarks));
        assertEquals("F", GradeCalculator.grade(finalMarks));
        assertFalse(GradeCalculator.isPass(finalMarks));
    }

    @Test
    void gradeBoundaries() {
        assertEquals("O", GradeCalculator.grade(bd("90")));
        assertEquals("A+", GradeCalculator.grade(bd("80")));
        assertEquals("A", GradeCalculator.grade(bd("70")));
        assertEquals("B+", GradeCalculator.grade(bd("60")));
        assertEquals("B", GradeCalculator.grade(bd("50")));
        assertEquals("C", GradeCalculator.grade(bd("40")));
        assertEquals("F", GradeCalculator.grade(bd("39.99")));
    }

    @Test
    void invalidMse_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> GradeCalculator.finalMarks(bd("31"), bd("50")));
        assertThrows(IllegalArgumentException.class,
                () -> GradeCalculator.finalMarks(bd("-1"), bd("50")));
    }

    @Test
    void invalidEse_throwsException() {
        assertThrows(IllegalArgumentException.class,
                () -> GradeCalculator.finalMarks(bd("20"), bd("71")));
        assertThrows(IllegalArgumentException.class,
                () -> GradeCalculator.finalMarks(bd("20"), bd("-5")));
    }

    @Test
    void contributions_matchExplicitFormula() {
        // MSE Contribution = (MSE / 30) x 30, ESE Contribution = (ESE / 70) x 70
        assertEquals(0, bd("25.00").compareTo(GradeCalculator.mseContribution(bd("25"))));
        assertEquals(0, bd("60.00").compareTo(GradeCalculator.eseContribution(bd("60"))));
    }
}
