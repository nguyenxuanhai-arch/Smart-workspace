package com.example.smartworkspace.mappers;

import java.util.List;

import com.example.smartworkspace.dtos.product.ProductImageResponse;
import com.example.smartworkspace.dtos.product.ProductResponse;
import com.example.smartworkspace.entities.Product;
import com.example.smartworkspace.entities.ProductImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final CategoryMapper categoryMapper;

    public ProductResponse toResponse(Product product, List<ProductImage> images) {
        return ProductResponse.builder()
                .id(product.getId())
                .category(categoryMapper.toSummaryResponse(product.getCategory()))
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .description(product.getDescription())
                .price(product.getPrice())
                .oldPrice(product.getOldPrice())
                .stockQuantity(product.getStockQuantity())
                .sku(product.getSku())
                .status(product.getStatus())
                .images(images.stream().map(this::toImageResponse).toList())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private ProductImageResponse toImageResponse(ProductImage image) {
        return ProductImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .altText(image.getAltText())
                .isPrimary(image.getIsPrimary())
                .sortOrder(image.getSortOrder())
                .build();
    }
}
