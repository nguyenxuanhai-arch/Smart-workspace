package com.example.smartworkspace.repositories;

import java.util.Optional;

import com.example.smartworkspace.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
