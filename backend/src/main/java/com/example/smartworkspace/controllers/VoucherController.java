package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.voucher.VoucherCheckResponse;
import com.example.smartworkspace.services.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping("/check")
    public ApiResponse<VoucherCheckResponse> checkVoucher(
            @RequestParam("code") String code,
            @RequestParam(value = "subtotal", required = false) BigDecimal subtotal
    ) {
        return ApiResponse.success(voucherService.validateVoucher(code, subtotal));
    }
}
