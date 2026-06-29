package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.upload.ProductImageUploadResponse;
import com.example.smartworkspace.services.ProductImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
public class AdminUploadController {
    private final ProductImageStorageService productImageStorageService;

    @PostMapping(value = "/product-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductImageUploadResponse> uploadProductImage(@RequestParam("file") MultipartFile file) {
        return ApiResponse.success(
                "Upload product image successfully",
                productImageStorageService.uploadProductImage(file)
        );
    }
}
