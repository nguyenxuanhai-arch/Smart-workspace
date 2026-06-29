package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.review.ProductReviewResponse;
import com.example.smartworkspace.dtos.review.ReviewStatusUpdateRequest;
import com.example.smartworkspace.services.ProductReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {
    private final ProductReviewService productReviewService;

    @PutMapping("/{id}/status")
    public ApiResponse<ProductReviewResponse> updateReviewStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReviewStatusUpdateRequest request
    ) {
        return ApiResponse.success("Update review status successfully", productReviewService.updateReviewStatus(id, request));
    }
}
