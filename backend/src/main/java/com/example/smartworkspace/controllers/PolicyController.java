package com.example.smartworkspace.controllers;

import java.util.List;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.policy.PolicyResponse;
import com.example.smartworkspace.enums.PolicyType;
import com.example.smartworkspace.services.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {
    private final PolicyService policyService;

    @GetMapping
    public ApiResponse<List<PolicyResponse>> getPolicies() {
        return ApiResponse.success(policyService.getActivePolicies());
    }

    @GetMapping("/{type}")
    public ApiResponse<PolicyResponse> getPolicyByType(@PathVariable PolicyType type) {
        return ApiResponse.success(policyService.getActivePolicyByType(type));
    }
}
