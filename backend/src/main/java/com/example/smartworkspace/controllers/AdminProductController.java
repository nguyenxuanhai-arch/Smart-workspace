package com.example.smartworkspace.controllers;

import java.math.BigDecimal;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.product.ProductRequest;
import com.example.smartworkspace.dtos.product.ProductResponse;
import com.example.smartworkspace.services.ProductService;
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
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {
    private final ProductService productService;

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> getProductsForAdmin(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(productService.getProductsForAdmin(
                search,
                categoryId,
                minPrice,
                maxPrice,
                sort,
                page,
                size
        ));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductForAdmin(@PathVariable Long id) {
        return ApiResponse.success(productService.getProductForAdmin(id));
    }

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ApiResponse.success("Create product successfully", productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ApiResponse.success("Update product successfully", productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success("Delete product successfully");
    }
}
