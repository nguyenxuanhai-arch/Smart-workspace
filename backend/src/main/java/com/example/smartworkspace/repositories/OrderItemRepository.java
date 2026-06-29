package com.example.smartworkspace.repositories;

import java.util.List;

import com.example.smartworkspace.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByOrderIdOrderByIdAsc(Long orderId);
}
