package com.example.smartworkspace.repositories;

import java.util.List;
import java.util.Optional;

import com.example.smartworkspace.entities.Category;
import com.example.smartworkspace.enums.CommonStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<Category> findByStatusOrderByIdAsc(CommonStatus status);

    Optional<Category> findByIdAndStatus(Long id, CommonStatus status);
}
