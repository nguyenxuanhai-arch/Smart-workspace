package com.example.smartworkspace.services;

import java.math.BigDecimal;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.customer.AdminCustomerResponse;
import com.example.smartworkspace.dtos.customer.CustomerStatusUpdateRequest;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.UserStatus;
import com.example.smartworkspace.repositories.OrderRepository;
import com.example.smartworkspace.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCustomerService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public PageResponse<AdminCustomerResponse> getCustomers(String search, UserStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        return PageResponse.from(userRepository.findAdminCustomers(normalize(search), status, pageable).map(this::toResponse));
    }

    @Transactional
    public AdminCustomerResponse updateCustomerStatus(Long id, CustomerStatusUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setStatus(request.getStatus());
        return toResponse(userRepository.save(user));
    }

    private AdminCustomerResponse toResponse(User user) {
        return AdminCustomerResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .orderCount(orderRepository.countByUserId(user.getId()))
                .totalSpent(defaultAmount(orderRepository.sumTotalAmountByUserId(user.getId())))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private BigDecimal defaultAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String normalize(String value) {
        String trimmed = value == null ? null : value.trim();
        return trimmed == null || trimmed.isEmpty() ? null : trimmed;
    }
}
