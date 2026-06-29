package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.policy.PolicyRequest;
import com.example.smartworkspace.dtos.policy.PolicyResponse;
import com.example.smartworkspace.services.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/policies")
@RequiredArgsConstructor
public class AdminPolicyController {
    private final PolicyService policyService;

    @PostMapping
    public ApiResponse<PolicyResponse> createPolicy(@Valid @RequestBody PolicyRequest request) {
        return ApiResponse.success("Create policy successfully", policyService.createPolicy(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<PolicyResponse> updatePolicy(
            @PathVariable Long id,
            @Valid @RequestBody PolicyRequest request
    ) {
        return ApiResponse.success("Update policy successfully", policyService.updatePolicy(id, request));
    }
}
