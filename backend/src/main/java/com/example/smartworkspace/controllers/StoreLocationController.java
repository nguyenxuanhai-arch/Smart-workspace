package com.example.smartworkspace.controllers;

import java.util.List;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.storelocation.StoreLocationResponse;
import com.example.smartworkspace.services.StoreLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/store-locations")
@RequiredArgsConstructor
public class StoreLocationController {
    private final StoreLocationService storeLocationService;

    @GetMapping
    public ApiResponse<List<StoreLocationResponse>> getStoreLocations() {
        return ApiResponse.success(storeLocationService.getActiveStoreLocations());
    }
}
