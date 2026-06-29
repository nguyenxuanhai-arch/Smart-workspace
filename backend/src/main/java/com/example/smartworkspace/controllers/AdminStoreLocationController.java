package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.storelocation.StoreLocationRequest;
import com.example.smartworkspace.dtos.storelocation.StoreLocationResponse;
import com.example.smartworkspace.services.StoreLocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/store-locations")
@RequiredArgsConstructor
public class AdminStoreLocationController {
    private final StoreLocationService storeLocationService;

    @PostMapping
    public ApiResponse<StoreLocationResponse> createStoreLocation(
            @Valid @RequestBody StoreLocationRequest request
    ) {
        return ApiResponse.success("Create store location successfully", storeLocationService.createStoreLocation(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<StoreLocationResponse> updateStoreLocation(
            @PathVariable Long id,
            @Valid @RequestBody StoreLocationRequest request
    ) {
        return ApiResponse.success("Update store location successfully", storeLocationService.updateStoreLocation(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteStoreLocation(@PathVariable Long id) {
        storeLocationService.deleteStoreLocation(id);
        return ApiResponse.success("Delete store location successfully");
    }
}
