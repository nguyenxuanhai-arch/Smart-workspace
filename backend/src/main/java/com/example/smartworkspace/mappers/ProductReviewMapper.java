package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.review.ProductReviewResponse;
import com.example.smartworkspace.entities.ProductReview;
import org.springframework.stereotype.Component;

@Component
public class ProductReviewMapper {
    public ProductReviewResponse toResponse(ProductReview review) {
        return ProductReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .userId(review.getUser().getId())
                .userFullName(review.getUser().getFullName())
                .rating(review.getRating())
                .content(review.getContent())
                .status(review.getStatus())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
