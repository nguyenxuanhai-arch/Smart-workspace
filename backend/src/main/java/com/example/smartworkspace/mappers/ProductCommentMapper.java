package com.example.smartworkspace.mappers;

import java.util.List;

import com.example.smartworkspace.dtos.comment.ProductCommentResponse;
import com.example.smartworkspace.entities.ProductComment;
import org.springframework.stereotype.Component;

@Component
public class ProductCommentMapper {
    public ProductCommentResponse toResponse(ProductComment comment, List<ProductCommentResponse> replies) {
        return ProductCommentResponse.builder()
                .id(comment.getId())
                .productId(comment.getProduct().getId())
                .userId(comment.getUser().getId())
                .userFullName(comment.getUser().getFullName())
                .parentId(comment.getParent() == null ? null : comment.getParent().getId())
                .content(comment.getContent())
                .status(comment.getStatus())
                .replies(replies)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
