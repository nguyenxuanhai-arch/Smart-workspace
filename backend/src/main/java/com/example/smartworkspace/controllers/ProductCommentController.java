package com.example.smartworkspace.controllers;

import java.util.List;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.comment.ProductCommentRequest;
import com.example.smartworkspace.dtos.comment.ProductCommentResponse;
import com.example.smartworkspace.services.ProductCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products/{productId}/comments")
@RequiredArgsConstructor
public class ProductCommentController {
    private final ProductCommentService productCommentService;

    @GetMapping
    public ApiResponse<List<ProductCommentResponse>> getProductComments(@PathVariable Long productId) {
        return ApiResponse.success(productCommentService.getProductComments(productId));
    }

    @PostMapping
    public ApiResponse<ProductCommentResponse> createComment(
            @PathVariable Long productId,
            @Valid @RequestBody ProductCommentRequest request
    ) {
        return ApiResponse.success("Create comment successfully", productCommentService.createComment(productId, request));
    }
}
