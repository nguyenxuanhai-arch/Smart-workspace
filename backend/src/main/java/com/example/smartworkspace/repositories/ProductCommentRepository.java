package com.example.smartworkspace.repositories;

import java.util.List;

import com.example.smartworkspace.entities.ProductComment;
import com.example.smartworkspace.enums.VisibilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCommentRepository extends JpaRepository<ProductComment, Long> {
    List<ProductComment> findByProductIdAndStatus(Long productId, VisibilityStatus status);

    List<ProductComment> findByProductIdAndStatusOrderByCreatedAtAsc(Long productId, VisibilityStatus status);
}
