package com.example.smartworkspace.dtos.order;

import com.example.smartworkspace.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
    @NotBlank(message = "Receiver name is required")
    @Size(max = 150, message = "Receiver name must be at most 150 characters")
    private String receiverName;

    @NotBlank(message = "Receiver phone is required")
    @Size(max = 30, message = "Receiver phone must be at most 30 characters")
    private String receiverPhone;

    @NotBlank(message = "Shipping address is required")
    @Size(max = 500, message = "Shipping address must be at most 500 characters")
    private String shippingAddress;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @Size(max = 500, message = "Note must be at most 500 characters")
    private String note;
}
