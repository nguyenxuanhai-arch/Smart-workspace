package com.example.smartworkspace.repositories;

import java.util.Optional;

import com.example.smartworkspace.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);
    java.util.List<Payment> findByOrder_User_Id(Long userId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("""
        select p
        from Payment p
        join fetch p.order o
        where p.providerOrderCode = :orderCode
    """)
    Optional<Payment> findByProviderOrderCodeForUpdate(@org.springframework.data.repository.query.Param("orderCode") Long orderCode);
}
