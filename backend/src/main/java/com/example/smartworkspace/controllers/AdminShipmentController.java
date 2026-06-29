package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.shipment.ShipmentResponse;
import com.example.smartworkspace.dtos.shipment.ShipmentStatusUpdateRequest;
import com.example.smartworkspace.services.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/shipments")
@RequiredArgsConstructor
public class AdminShipmentController {
    private final ShipmentService shipmentService;

    @PutMapping("/{id}/status")
    public ApiResponse<ShipmentResponse> updateShipmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody ShipmentStatusUpdateRequest request
    ) {
        return ApiResponse.success("Update shipment status successfully", shipmentService.updateShipmentStatus(id, request));
    }
}
