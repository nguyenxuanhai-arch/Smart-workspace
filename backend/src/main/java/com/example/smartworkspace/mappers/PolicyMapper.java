package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.policy.PolicyResponse;
import com.example.smartworkspace.entities.Policy;
import org.springframework.stereotype.Component;

@Component
public class PolicyMapper {
    public PolicyResponse toResponse(Policy policy) {
        return PolicyResponse.builder()
                .id(policy.getId())
                .type(policy.getType())
                .title(policy.getTitle())
                .content(policy.getContent())
                .status(policy.getStatus())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }
}
