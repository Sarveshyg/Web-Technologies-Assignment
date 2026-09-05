package com.vit.result.service;

import com.vit.result.dto.ResultRequest;
import com.vit.result.dto.SubjectRequest;
import com.vit.result.entity.StudentResult;
import com.vit.result.entity.SubjectResult;
import com.vit.result.repository.StudentResultRepository;
import com.vit.result.util.GradeCalculator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// All calculation + database logic lives here (not in the controller).
@Service
public class ResultService {

    private final StudentResultRepository studentResultRepository;

    public ResultService(StudentResultRepository studentResultRepository) {
        this.studentResultRepository = studentResultRepository;
    }

    // Calculate the result, save it, and return the saved entity.
    @Transactional
    public StudentResult calculateAndSave(ResultRequest request) {
        StudentResult student = new StudentResult();
        student.setStudentName(request.getStudentName().trim());
        student.setPrn(request.getPrn().trim());
        student.setSemester(request.getSemester());
        student.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        boolean allPass = true;

        for (SubjectRequest s : request.getSubjects()) {
            BigDecimal mse = s.getMseMarks();
            BigDecimal ese = s.getEseMarks();

            BigDecimal finalMarks = GradeCalculator.finalMarks(mse, ese);
            String grade = GradeCalculator.grade(finalMarks);

            if (!GradeCalculator.isPass(finalMarks)) {
                allPass = false;
            }
            total = total.add(finalMarks);

            SubjectResult subject = new SubjectResult();
            subject.setSubjectName(s.getSubjectName().trim());
            subject.setMseMarks(GradeCalculator.round2(mse));
            subject.setEseMarks(GradeCalculator.round2(ese));
            subject.setFinalMarks(finalMarks);
            subject.setGrade(grade);
            student.addSubject(subject);
        }

        total = total.setScale(2, RoundingMode.HALF_UP);
        // Percentage = total / 400 * 100
        BigDecimal percentage = total
                .divide(new BigDecimal("400"), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP);

        student.setTotalMarks(total);
        student.setPercentage(percentage);
        student.setResultStatus(allPass ? "PASS" : "FAIL");

        return studentResultRepository.save(student);
    }

    public List<StudentResult> findAllLatestFirst() {
        List<StudentResult> all = studentResultRepository.findAll();
        // Newest first (simple in-memory sort, fine for a college project).
        all.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return all;
    }

    public Optional<StudentResult> findById(Long id) {
        return studentResultRepository.findById(id);
    }
}
