package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.payment.PaymentRequest;
import com.example.smartworkspace.dtos.payment.PaymentResponse;
import com.example.smartworkspace.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/{orderId}")
    public ApiResponse<PaymentResponse> createPayment(
            @PathVariable Long orderId,
            @Valid @RequestBody PaymentRequest request
    ) {
        return ApiResponse.success("Create payment successfully", paymentService.createMockPayment(orderId, request));
    }

    @org.springframework.web.bind.annotation.GetMapping("/my")
    public ApiResponse<java.util.List<PaymentResponse>> getMyPayments() {
        return ApiResponse.success(paymentService.getMyPayments());
    }

    @org.springframework.web.bind.annotation.GetMapping("/all")
    public ApiResponse<java.util.List<PaymentResponse>> getAllPayments() {
        return ApiResponse.success(paymentService.getAllPayments());
    }

    @PostMapping("/payos/checkout")
    public ApiResponse<com.example.smartworkspace.dtos.payment.CreatePayOSCheckoutResponse> createPayOSCheckout(
            @Valid @RequestBody com.example.smartworkspace.dtos.payment.CreatePayOSCheckoutRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.example.smartworkspace.securities.CustomUserDetails userDetails,
            @org.springframework.beans.factory.annotation.Autowired com.example.smartworkspace.services.PayOSPaymentService payOSPaymentService
    ) {
        return ApiResponse.success("Create PayOS checkout successfully", 
            payOSPaymentService.createCheckout(request.getOrderId(), userDetails.getUser().getId()));
    }
}
