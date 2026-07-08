package com.example.smartworkspace.repositories;

import com.example.smartworkspace.entities.Promotion;
import com.example.smartworkspace.enums.CommonStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    @Query("""
            select p from Promotion p
            where (:status is null or p.status = :status)
              and (
                :search is null
                or lower(p.name) like lower(concat('%', :search, '%'))
                or lower(coalesce(p.description, '')) like lower(concat('%', :search, '%'))
              )
            order by p.startDate desc
            """)
    Page<Promotion> findAdminPromotions(
            @Param("search") String search,
            @Param("status") CommonStatus status,
            Pageable pageable
    );
}
