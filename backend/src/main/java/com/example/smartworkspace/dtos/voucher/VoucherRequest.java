package com.example.smartworkspace.dtos.voucher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.enums.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherRequest {
    @NotBlank
    @Size(max = 80)
    private String code;

    @NotBlank
    @Size(max = 150)
    private String name;

    private String description;

    @NotNull
    private DiscountType discountType;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal discountValue;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal minOrderAmount;

    @Min(0)
    private Integer usageLimit;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    @NotNull
    private CommonStatus status;
}
