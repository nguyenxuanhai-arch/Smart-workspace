package com.example.smartworkspace.repositories;

import java.util.List;
import java.util.Optional;

import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Order> findByOrderCode(String orderCode);

    long countByStatus(OrderStatus status);
}
