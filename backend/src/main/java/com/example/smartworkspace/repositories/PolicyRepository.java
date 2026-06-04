package com.example.smartworkspace.repositories;

import java.util.Optional;

import com.example.smartworkspace.entities.Policy;
import com.example.smartworkspace.enums.PolicyType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findByType(PolicyType type);
}
