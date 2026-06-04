package com.example.smartworkspace.services;

import java.time.LocalDateTime;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.shipment.ShipmentResponse;
import com.example.smartworkspace.dtos.shipment.ShipmentStatusUpdateRequest;
import com.example.smartworkspace.entities.Shipment;
import com.example.smartworkspace.enums.ShipmentStatus;
import com.example.smartworkspace.mappers.ShipmentMapper;
import com.example.smartworkspace.repositories.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShipmentService {
    private final ShipmentRepository shipmentRepository;
    private final ShipmentMapper shipmentMapper;

    @Transactional
    public ShipmentResponse updateShipmentStatus(Long id, ShipmentStatusUpdateRequest request) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHIPMENT_NOT_FOUND));

        shipment.setShippingStatus(request.getShippingStatus());
        if (request.getCarrierName() != null) {
            shipment.setCarrierName(trim(request.getCarrierName()));
        }
        if (request.getTrackingCode() != null) {
            shipment.setTrackingCode(trim(request.getTrackingCode()));
        }
        if (request.getEstimatedDeliveryDate() != null) {
            shipment.setEstimatedDeliveryDate(request.getEstimatedDeliveryDate());
        }
        if (request.getShippingStatus() == ShipmentStatus.DELIVERED && shipment.getDeliveredAt() == null) {
            shipment.setDeliveredAt(LocalDateTime.now());
        }

        return shipmentMapper.toResponse(shipmentRepository.save(shipment));
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
