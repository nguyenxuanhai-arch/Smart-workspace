package com.example.smartworkspace.repositories;

import com.example.smartworkspace.entities.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
    boolean existsByJti(String jti);
}
