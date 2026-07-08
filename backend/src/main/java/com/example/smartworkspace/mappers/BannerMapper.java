package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.banner.BannerResponse;
import com.example.smartworkspace.entities.Banner;
import org.springframework.stereotype.Component;

@Component
public class BannerMapper {
    public BannerResponse toResponse(Banner banner) {
        return BannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .imageUrl(banner.getImageUrl())
                .linkUrl(banner.getLinkUrl())
                .position(banner.getPosition())
                .sortOrder(banner.getSortOrder())
                .startDate(banner.getStartDate())
                .endDate(banner.getEndDate())
                .status(banner.getStatus())
                .createdAt(banner.getCreatedAt())
                .updatedAt(banner.getUpdatedAt())
                .build();
    }
}
