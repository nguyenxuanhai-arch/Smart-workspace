package com.example.smartworkspace.repositories;

import java.util.Optional;

import com.example.smartworkspace.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);
}
