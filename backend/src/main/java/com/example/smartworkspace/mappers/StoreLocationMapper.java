package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.storelocation.StoreLocationResponse;
import com.example.smartworkspace.entities.StoreLocation;
import org.springframework.stereotype.Component;

@Component
public class StoreLocationMapper {
    public StoreLocationResponse toResponse(StoreLocation storeLocation) {
        return StoreLocationResponse.builder()
                .id(storeLocation.getId())
                .name(storeLocation.getName())
                .address(storeLocation.getAddress())
                .phone(storeLocation.getPhone())
                .latitude(storeLocation.getLatitude())
                .longitude(storeLocation.getLongitude())
                .googleMapUrl(storeLocation.getGoogleMapUrl())
                .status(storeLocation.getStatus())
                .createdAt(storeLocation.getCreatedAt())
                .updatedAt(storeLocation.getUpdatedAt())
                .build();
    }
}
