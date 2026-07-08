package com.example.smartworkspace.repositories;

import java.util.List;
import java.util.Optional;

import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndVoucherCodeAndStatusNot(Long userId, String voucherCode, OrderStatus status);

    Optional<Order> findByIdAndUserId(Long id, Long userId);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<Order> findByOrderCode(String orderCode);

    long countByStatus(OrderStatus status);

    @Query("select coalesce(sum(o.totalAmount), 0) from Order o where o.status = :status")
    BigDecimal sumTotalAmountByStatus(@Param("status") OrderStatus status);

    long countByUserId(Long userId);

    @Query("select coalesce(sum(o.totalAmount), 0) from Order o where o.user.id = :userId and o.status <> com.example.smartworkspace.enums.OrderStatus.CANCELLED")
    BigDecimal sumTotalAmountByUserId(@Param("userId") Long userId);

    List<Order> findByStatusAndCreatedAtGreaterThanEqualOrderByCreatedAtAsc(
            OrderStatus status,
            LocalDateTime createdAt
    );
}
