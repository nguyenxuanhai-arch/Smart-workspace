package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.category.CategoryResponse;
import com.example.smartworkspace.dtos.category.CategorySummaryResponse;
import com.example.smartworkspace.entities.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryResponse toResponse(Category category) {
        Category parent = category.getParent();

        return CategoryResponse.builder()
                .id(category.getId())
                .parentId(parent == null ? null : parent.getId())
                .parentName(parent == null ? null : parent.getName())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .status(category.getStatus())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    public CategorySummaryResponse toSummaryResponse(Category category) {
        return CategorySummaryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }
}
