package com.example.smartworkspace.repositories;

import com.example.smartworkspace.entities.Banner;
import com.example.smartworkspace.enums.CommonStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    @Query("""
            select b from Banner b
            where (:status is null or b.status = :status)
              and (:position is null or b.position = :position)
              and (
                :search is null
                or lower(b.title) like lower(concat('%', :search, '%'))
                or lower(b.position) like lower(concat('%', :search, '%'))
              )
            order by b.sortOrder asc, b.createdAt desc
            """)
    Page<Banner> findAdminBanners(
            @Param("search") String search,
            @Param("status") CommonStatus status,
            @Param("position") String position,
            Pageable pageable
    );
}
