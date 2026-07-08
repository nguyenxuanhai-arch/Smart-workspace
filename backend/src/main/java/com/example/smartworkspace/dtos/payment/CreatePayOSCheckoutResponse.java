package com.example.smartworkspace.dtos.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePayOSCheckoutResponse {
    private Long orderId;
    private Long providerOrderCode;
    private String paymentLinkId;
    private String status;
    private String checkoutUrl;
    private String qrCode;
    private Long expiredAt;
}
