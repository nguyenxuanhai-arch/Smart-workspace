package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.comment.CommentStatusUpdateRequest;
import com.example.smartworkspace.dtos.comment.ProductCommentResponse;
import com.example.smartworkspace.services.ProductCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/comments")
@RequiredArgsConstructor
public class AdminCommentController {
    private final ProductCommentService productCommentService;

    @PutMapping("/{id}/status")
    public ApiResponse<ProductCommentResponse> updateCommentStatus(
            @PathVariable Long id,
            @Valid @RequestBody CommentStatusUpdateRequest request
    ) {
        return ApiResponse.success("Update comment status successfully", productCommentService.updateCommentStatus(id, request));
    }
}
