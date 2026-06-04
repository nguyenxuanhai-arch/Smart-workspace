package com.example.smartworkspace.dtos.product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.smartworkspace.dtos.category.CategorySummaryResponse;
import com.example.smartworkspace.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private CategorySummaryResponse category;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private Integer stockQuantity;
    private String sku;
    private ProductStatus status;
    private List<ProductImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
