package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.feedback.FeedbackResponse;
import com.example.smartworkspace.dtos.feedback.FeedbackStatusUpdateRequest;
import com.example.smartworkspace.services.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/feedbacks")
@RequiredArgsConstructor
public class AdminFeedbackController {
    private final FeedbackService feedbackService;

    @GetMapping
    public ApiResponse<PageResponse<FeedbackResponse>> getFeedbacks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(feedbackService.getAdminFeedbacks(page, size));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<FeedbackResponse> updateFeedbackStatus(
            @PathVariable Long id,
            @Valid @RequestBody FeedbackStatusUpdateRequest request
    ) {
        return ApiResponse.success("Update feedback status successfully", feedbackService.updateFeedbackStatus(id, request));
    }
}
