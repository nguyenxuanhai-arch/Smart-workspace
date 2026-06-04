package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.shipment.ShipmentResponse;
import com.example.smartworkspace.entities.Shipment;
import org.springframework.stereotype.Component;

@Component
public class ShipmentMapper {
    public ShipmentResponse toResponse(Shipment shipment) {
        if (shipment == null) {
            return null;
        }

        return ShipmentResponse.builder()
                .id(shipment.getId())
                .orderId(shipment.getOrder().getId())
                .carrierName(shipment.getCarrierName())
                .trackingCode(shipment.getTrackingCode())
                .shippingStatus(shipment.getShippingStatus())
                .estimatedDeliveryDate(shipment.getEstimatedDeliveryDate())
                .deliveredAt(shipment.getDeliveredAt())
                .createdAt(shipment.getCreatedAt())
                .updatedAt(shipment.getUpdatedAt())
                .build();
    }
}
