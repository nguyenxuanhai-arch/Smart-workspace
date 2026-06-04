package com.example.smartworkspace.services;

import java.util.List;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.policy.PolicyRequest;
import com.example.smartworkspace.dtos.policy.PolicyResponse;
import com.example.smartworkspace.entities.Policy;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.enums.PolicyType;
import com.example.smartworkspace.mappers.PolicyMapper;
import com.example.smartworkspace.repositories.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PolicyService {
    private final PolicyRepository policyRepository;
    private final PolicyMapper policyMapper;

    @Transactional(readOnly = true)
    public List<PolicyResponse> getActivePolicies() {
        return policyRepository.findByStatusOrderByIdAsc(CommonStatus.ACTIVE).stream()
                .map(policyMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PolicyResponse getActivePolicyByType(PolicyType type) {
        Policy policy = policyRepository.findByTypeAndStatus(type, CommonStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.POLICY_NOT_FOUND));
        return policyMapper.toResponse(policy);
    }

    @Transactional
    public PolicyResponse createPolicy(PolicyRequest request) {
        if (policyRepository.existsByType(request.getType())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Policy type already exists");
        }

        Policy policy = new Policy();
        applyRequest(policy, request);
        return policyMapper.toResponse(policyRepository.save(policy));
    }

    @Transactional
    public PolicyResponse updatePolicy(Long id, PolicyRequest request) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POLICY_NOT_FOUND));
        if (policyRepository.existsByTypeAndIdNot(request.getType(), id)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Policy type already exists");
        }

        applyRequest(policy, request);
        return policyMapper.toResponse(policyRepository.save(policy));
    }

    private void applyRequest(Policy policy, PolicyRequest request) {
        policy.setType(request.getType());
        policy.setTitle(trim(request.getTitle()));
        policy.setContent(trim(request.getContent()));
        policy.setStatus(request.getStatus() == null ? CommonStatus.ACTIVE : request.getStatus());
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
