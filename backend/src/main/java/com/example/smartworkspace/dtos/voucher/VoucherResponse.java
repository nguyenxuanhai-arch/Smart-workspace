package com.example.smartworkspace.dtos.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.enums.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private CommonStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
