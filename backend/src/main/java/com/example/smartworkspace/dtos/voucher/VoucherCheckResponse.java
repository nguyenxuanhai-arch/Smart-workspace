package com.example.smartworkspace.dtos.voucher;

import com.example.smartworkspace.enums.DiscountType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class VoucherCheckResponse {
    private boolean valid;
    private String voucherCode;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal amountAfterDiscount;
    private String message;
}
