package com.example.smartworkspace.repositories;

import java.util.Optional;

import com.example.smartworkspace.entities.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByOrderId(Long orderId);
}
