package com.example.smartworkspace.dtos.review;

import java.time.LocalDateTime;

import com.example.smartworkspace.enums.VisibilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long userId;
    private String userFullName;
    private Integer rating;
    private String content;
    private VisibilityStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
