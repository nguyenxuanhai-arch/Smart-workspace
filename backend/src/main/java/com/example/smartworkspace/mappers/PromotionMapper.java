package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.promotion.PromotionResponse;
import com.example.smartworkspace.entities.Promotion;
import org.springframework.stereotype.Component;

@Component
public class PromotionMapper {
    public PromotionResponse toResponse(Promotion promotion) {
        return PromotionResponse.builder()
                .id(promotion.getId())
                .name(promotion.getName())
                .description(promotion.getDescription())
                .discountType(promotion.getDiscountType())
                .discountValue(promotion.getDiscountValue())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .status(promotion.getStatus())
                .createdAt(promotion.getCreatedAt())
                .updatedAt(promotion.getUpdatedAt())
                .build();
    }
}
