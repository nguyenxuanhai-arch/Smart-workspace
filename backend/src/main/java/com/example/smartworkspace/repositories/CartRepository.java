package com.example.smartworkspace.repositories;

import java.util.Optional;

import com.example.smartworkspace.entities.Cart;
import com.example.smartworkspace.enums.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserIdAndStatus(Long userId, CartStatus status);
}
