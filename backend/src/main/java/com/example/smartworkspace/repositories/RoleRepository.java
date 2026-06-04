package com.example.smartworkspace.repositories;

import java.util.Optional;

import com.example.smartworkspace.entities.Role;
import com.example.smartworkspace.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
