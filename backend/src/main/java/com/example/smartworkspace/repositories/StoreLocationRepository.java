package com.example.smartworkspace.repositories;

import java.util.List;

import com.example.smartworkspace.entities.StoreLocation;
import com.example.smartworkspace.enums.CommonStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreLocationRepository extends JpaRepository<StoreLocation, Long> {
    List<StoreLocation> findByStatus(CommonStatus status);
}
