package com.example.smartworkspace.repositories;

import com.example.smartworkspace.entities.Voucher;
import com.example.smartworkspace.enums.CommonStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);

    @Query("""
            select v from Voucher v
            where (:status is null or v.status = :status)
              and (
                :search is null
                or lower(v.code) like lower(concat('%', :search, '%'))
                or lower(v.name) like lower(concat('%', :search, '%'))
                or lower(coalesce(v.description, '')) like lower(concat('%', :search, '%'))
              )
            order by v.createdAt desc
            """)
    Page<Voucher> findAdminVouchers(
            @Param("search") String search,
            @Param("status") CommonStatus status,
            Pageable pageable
    );
}
