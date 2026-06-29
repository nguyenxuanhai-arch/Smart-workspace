package com.example.smartworkspace.dtos.payment;

import com.example.smartworkspace.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentStatusUpdateRequest {
    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;
}
