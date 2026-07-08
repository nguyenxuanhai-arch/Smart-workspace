package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.review.ProductReviewResponse;
import com.example.smartworkspace.dtos.review.ReviewStatusUpdateRequest;
import com.example.smartworkspace.enums.VisibilityStatus;
import com.example.smartworkspace.services.ProductReviewService;
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
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {
    private final ProductReviewService productReviewService;

    @GetMapping
    public ApiResponse<PageResponse<ProductReviewResponse>> getReviews(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) VisibilityStatus status,
            @RequestParam(required = false) Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(productReviewService.getReviewsForAdmin(search, status, productId, page, size));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<ProductReviewResponse> updateReviewStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReviewStatusUpdateRequest request
    ) {
        return ApiResponse.success("Update review status successfully", productReviewService.updateReviewStatus(id, request));
    }
}
