package com.example.smartworkspace.repositories;

import java.util.List;
import java.util.Optional;

import com.example.smartworkspace.entities.ProductReview;
import com.example.smartworkspace.enums.VisibilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProductIdAndStatus(Long productId, VisibilityStatus status);

    Optional<ProductReview> findByProductIdAndUserId(Long productId, Long userId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);
}
