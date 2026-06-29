package com.example.smartworkspace.repositories;

import java.util.Optional;
import java.util.List;

import com.example.smartworkspace.entities.Policy;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.enums.PolicyType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByStatusOrderByIdAsc(CommonStatus status);

    Optional<Policy> findByType(PolicyType type);

    Optional<Policy> findByTypeAndStatus(PolicyType type, CommonStatus status);

    boolean existsByType(PolicyType type);

    boolean existsByTypeAndIdNot(PolicyType type, Long id);
}
