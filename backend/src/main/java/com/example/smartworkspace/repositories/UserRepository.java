package com.example.smartworkspace.repositories;

import java.util.Optional;

import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByPhoneAndIdNot(String phone, Long id);

    @Query("""
            select u from User u
            where (:status is null or u.status = :status)
              and (
                :search is null
                or lower(u.fullName) like lower(concat('%', :search, '%'))
                or lower(u.email) like lower(concat('%', :search, '%'))
                or u.phone like concat('%', :search, '%')
              )
            order by u.createdAt desc
            """)
    Page<User> findAdminCustomers(
            @Param("search") String search,
            @Param("status") UserStatus status,
            Pageable pageable
    );
}
