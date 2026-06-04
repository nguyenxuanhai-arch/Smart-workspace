package com.example.smartworkspace.dtos.shipment;

import java.time.LocalDateTime;

import com.example.smartworkspace.enums.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShipmentStatusUpdateRequest {
    @NotNull(message = "Shipping status is required")
    private ShipmentStatus shippingStatus;

    @Size(max = 100, message = "Carrier name must be at most 100 characters")
    private String carrierName;

    @Size(max = 100, message = "Tracking code must be at most 100 characters")
    private String trackingCode;

    private LocalDateTime estimatedDeliveryDate;
}
