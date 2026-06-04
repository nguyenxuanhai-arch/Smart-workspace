package com.example.smartworkspace.repositories;

import java.util.List;

import com.example.smartworkspace.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
}
