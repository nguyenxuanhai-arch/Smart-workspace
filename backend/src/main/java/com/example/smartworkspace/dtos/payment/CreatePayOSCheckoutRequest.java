package com.example.smartworkspace.dtos.payment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePayOSCheckoutRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;
}
