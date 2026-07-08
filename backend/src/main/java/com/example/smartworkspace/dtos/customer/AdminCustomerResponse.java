package com.example.smartworkspace.dtos.customer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.smartworkspace.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCustomerResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private UserStatus status;
    private long orderCount;
    private BigDecimal totalSpent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
