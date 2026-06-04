package com.example.smartworkspace.dtos.category;

import com.example.smartworkspace.enums.CommonStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {
    private Long parentId;

    @NotBlank(message = "Name is required")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String name;

    @NotBlank(message = "Slug is required")
    @Size(max = 180, message = "Slug must be at most 180 characters")
    private String slug;

    private String description;
    private CommonStatus status;
}
