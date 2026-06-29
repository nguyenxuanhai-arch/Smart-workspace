package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.feedback.FeedbackRequest;
import com.example.smartworkspace.dtos.feedback.FeedbackResponse;
import com.example.smartworkspace.services.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping
    public ApiResponse<FeedbackResponse> createFeedback(@Valid @RequestBody FeedbackRequest request) {
        return ApiResponse.success("Create feedback successfully", feedbackService.createFeedback(request));
    }
}
