package com.example.smartworkspace.dtos.comment;

import java.time.LocalDateTime;
import java.util.List;

import com.example.smartworkspace.enums.VisibilityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCommentResponse {
    private Long id;
    private Long productId;
    private Long userId;
    private String userFullName;
    private Long parentId;
    private String content;
    private VisibilityStatus status;
    private List<ProductCommentResponse> replies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
