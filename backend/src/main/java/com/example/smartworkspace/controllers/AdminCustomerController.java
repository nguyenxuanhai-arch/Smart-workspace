package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.customer.AdminCustomerResponse;
import com.example.smartworkspace.dtos.customer.CustomerStatusUpdateRequest;
import com.example.smartworkspace.enums.UserStatus;
import com.example.smartworkspace.services.AdminCustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {
    private final AdminCustomerService adminCustomerService;

    @GetMapping
    public ApiResponse<PageResponse<AdminCustomerResponse>> getCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(adminCustomerService.getCustomers(search, status, page, size));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<AdminCustomerResponse> updateCustomerStatus(
            @PathVariable Long id,
            @Valid @RequestBody CustomerStatusUpdateRequest request
    ) {
        return ApiResponse.success("Update customer status successfully", adminCustomerService.updateCustomerStatus(id, request));
    }
}
