package com.example.smartworkspace.dtos.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductCommentRequest {
    @NotBlank(message = "Content is required")
    private String content;

    private Long parentId;
}
