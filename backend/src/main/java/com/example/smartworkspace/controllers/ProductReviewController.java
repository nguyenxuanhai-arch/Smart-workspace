package com.example.smartworkspace.controllers;

import java.util.List;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.review.ProductReviewRequest;
import com.example.smartworkspace.dtos.review.ProductReviewResponse;
import com.example.smartworkspace.services.ProductReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ProductReviewController {
    private final ProductReviewService productReviewService;

    @GetMapping
    public ApiResponse<List<ProductReviewResponse>> getProductReviews(@PathVariable Long productId) {
        return ApiResponse.success(productReviewService.getProductReviews(productId));
    }

    @PostMapping
    public ApiResponse<ProductReviewResponse> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ProductReviewRequest request
    ) {
        return ApiResponse.success("Create review successfully", productReviewService.createReview(productId, request));
    }
}
