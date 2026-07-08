package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.payment.CreatePayOSCheckoutRequest;
import com.example.smartworkspace.dtos.payment.CreatePayOSCheckoutResponse;
import com.example.smartworkspace.dtos.payment.PaymentRequest;
import com.example.smartworkspace.dtos.payment.PaymentResponse;
import com.example.smartworkspace.securities.CustomUserDetails;
import com.example.smartworkspace.services.PayOSPaymentService;
import com.example.smartworkspace.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final PayOSPaymentService payOSPaymentService;

    @PostMapping("/{orderId}")
    public ApiResponse<PaymentResponse> createPayment(
            @PathVariable Long orderId,
            @Valid @RequestBody PaymentRequest request
    ) {
        return ApiResponse.success("Create payment successfully", paymentService.createMockPayment(orderId, request));
    }

    @GetMapping("/my")
    public ApiResponse<java.util.List<PaymentResponse>> getMyPayments() {
        return ApiResponse.success(paymentService.getMyPayments());
    }

    @GetMapping("/all")
    public ApiResponse<java.util.List<PaymentResponse>> getAllPayments() {
        return ApiResponse.success(paymentService.getAllPayments());
    }

    @PostMapping("/payos/checkout")
    public ApiResponse<CreatePayOSCheckoutResponse> createPayOSCheckout(
            @Valid @RequestBody CreatePayOSCheckoutRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Create PayOS checkout successfully",
            payOSPaymentService.createCheckout(request.getOrderId(), userDetails.getUser().getId()));
    }

    @PostMapping("/payos/sync")
    public ApiResponse<String> syncPayOS(
            @RequestBody java.util.Map<String, Long> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long orderCode = payload.get("orderCode");
        if (orderCode == null) {
            throw new IllegalArgumentException("orderCode is required");
        }
        String status = payOSPaymentService.syncPayment(orderCode, userDetails.getUser().getId());
        return ApiResponse.success("Sync payment successfully", status);
    }
}

