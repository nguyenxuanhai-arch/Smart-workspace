package com.example.smartworkspace.repositories;

import java.util.List;
import java.util.Optional;

import com.example.smartworkspace.entities.ProductReview;
import com.example.smartworkspace.enums.VisibilityStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProductIdAndStatus(Long productId, VisibilityStatus status);

    List<ProductReview> findByProductIdAndStatusOrderByCreatedAtDesc(Long productId, VisibilityStatus status);

    Optional<ProductReview> findByProductIdAndUserId(Long productId, Long userId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);

    @Query(value = """
            select r from ProductReview r
            join fetch r.product p
            join fetch r.user u
            where (:status is null or r.status = :status)
              and (:productId is null or p.id = :productId)
              and (
                :search is null
                or lower(p.name) like lower(concat('%', :search, '%'))
                or lower(u.fullName) like lower(concat('%', :search, '%'))
                or lower(coalesce(r.content, '')) like lower(concat('%', :search, '%'))
              )
            """,
            countQuery = """
            select count(r) from ProductReview r
            join r.product p
            join r.user u
            where (:status is null or r.status = :status)
              and (:productId is null or p.id = :productId)
              and (
                :search is null
                or lower(p.name) like lower(concat('%', :search, '%'))
                or lower(u.fullName) like lower(concat('%', :search, '%'))
                or lower(coalesce(r.content, '')) like lower(concat('%', :search, '%'))
              )
            """)
    Page<ProductReview> findAdminReviews(
            @Param("search") String search,
            @Param("status") VisibilityStatus status,
            @Param("productId") Long productId,
            Pageable pageable
    );
}
