package com.example.smartworkspace.repositories;

import java.util.List;

import com.example.smartworkspace.dtos.dashboard.TopProductResponse;
import com.example.smartworkspace.entities.OrderItem;
import com.example.smartworkspace.enums.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByOrderIdOrderByIdAsc(Long orderId);

    @Query("""
            select new com.example.smartworkspace.dtos.dashboard.TopProductResponse(
                oi.product.id,
                oi.productName,
                oi.productSku,
                sum(oi.quantity),
                coalesce(sum(oi.subtotal), 0)
            )
            from OrderItem oi
            where oi.order.status = :status
            group by oi.product.id, oi.productName, oi.productSku
            order by sum(oi.quantity) desc, sum(oi.subtotal) desc
            """)
    List<TopProductResponse> findTopProductsByOrderStatus(
            @Param("status") OrderStatus status,
            Pageable pageable
    );
}
