package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.promotion.PromotionRequest;
import com.example.smartworkspace.dtos.promotion.PromotionResponse;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.services.PromotionService;
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
@RequestMapping("/api/admin/promotions")
@RequiredArgsConstructor
public class  AdminPromotionController {
    private final PromotionService promotionService;

    @GetMapping
    public ApiResponse<PageResponse<PromotionResponse>> getPromotions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) CommonStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(promotionService.getPromotions(search, status, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<PromotionResponse> getPromotion(@PathVariable Long id) {
        return ApiResponse.success(promotionService.getPromotion(id));
    }

    @PostMapping
    public ApiResponse<PromotionResponse> createPromotion(@Valid @RequestBody PromotionRequest request) {
        return ApiResponse.success("Create promotion successfully", promotionService.createPromotion(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<PromotionResponse> updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody PromotionRequest request
    ) {
        return ApiResponse.success("Update promotion successfully", promotionService.updatePromotion(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ApiResponse.success("Delete promotion successfully");
    }
}
