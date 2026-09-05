package com.vit.result.controller;

import com.vit.result.dto.ResultRequest;
import com.vit.result.entity.StudentResult;
import com.vit.result.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

// Handles the three pages: form (/), history (/results), detail (/results/{id}).
@Controller
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    // Home page: empty result entry form.
    @GetMapping("/")
    public String showForm(Model model) {
        model.addAttribute("resultRequest", new ResultRequest());
        return "index";
    }

    // Form submit: validate, calculate, save, then show the result.
    @PostMapping("/calculate")
    public String calculate(@Valid @ModelAttribute("resultRequest") ResultRequest resultRequest,
                            BindingResult bindingResult,
                            Model model) {
        if (bindingResult.hasErrors()) {
            // Stay on the form and show validation messages.
            return "index";
        }
        StudentResult saved = resultService.calculateAndSave(resultRequest);
        // Redirect to the saved result page (avoids double submit on refresh).
        return "redirect:/results/" + saved.getId();
    }

    // History page: list of all saved results.
    @GetMapping("/results")
    public String history(Model model) {
        model.addAttribute("results", resultService.findAllLatestFirst());
        return "history";
    }

    // Single result detail page.
    @GetMapping("/results/{id}")
    public String viewResult(@PathVariable Long id, Model model) {
        Optional<StudentResult> found = resultService.findById(id);
        if (found.isEmpty()) {
            model.addAttribute("errorMessage", "No result found for ID: " + id);
            return "error";
        }
        model.addAttribute("result", found.get());
        return "result";
    }
}
