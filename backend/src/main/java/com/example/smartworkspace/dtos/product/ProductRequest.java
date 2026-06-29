package com.example.smartworkspace.dtos.product;

import java.math.BigDecimal;
import java.util.List;

import com.example.smartworkspace.enums.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {
    @NotNull(message = "Category id is required")
    private Long categoryId;

    @NotBlank(message = "Name is required")
    @Size(max = 200, message = "Name must be at most 200 characters")
    private String name;

    @NotBlank(message = "Slug is required")
    @Size(max = 220, message = "Slug must be at most 220 characters")
    private String slug;

    @Size(max = 500, message = "Short description must be at most 500 characters")
    private String shortDescription;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price must be greater than or equal to 0")
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Old price must be greater than or equal to 0")
    private BigDecimal oldPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be greater than or equal to 0")
    private Integer stockQuantity;

    @NotBlank(message = "SKU is required")
    @Size(max = 100, message = "SKU must be at most 100 characters")
    private String sku;

    private ProductStatus status;
    private List<@Size(max = 500, message = "Image URL must be at most 500 characters") String> imageUrls;
}
