package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.banner.BannerRequest;
import com.example.smartworkspace.dtos.banner.BannerResponse;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.services.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {
    private final BannerService bannerService;

    @GetMapping
    public ApiResponse<PageResponse<BannerResponse>> getBanners(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) CommonStatus status,
            @RequestParam(required = false) String position,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(bannerService.getBanners(search, status, position, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<BannerResponse> getBanner(@PathVariable Long id) {
        return ApiResponse.success(bannerService.getBanner(id));
    }

    @PostMapping
    public ApiResponse<BannerResponse> createBanner(@Valid @RequestBody BannerRequest request) {
        return ApiResponse.success("Create banner successfully", bannerService.createBanner(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<BannerResponse> updateBanner(
            @PathVariable Long id,
            @Valid @RequestBody BannerRequest request
    ) {
        return ApiResponse.success("Update banner successfully", bannerService.updateBanner(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ApiResponse.success("Delete banner successfully");
    }
}
