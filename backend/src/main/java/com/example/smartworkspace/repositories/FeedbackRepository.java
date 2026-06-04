package com.example.smartworkspace.repositories;

import com.example.smartworkspace.entities.Feedback;
import com.example.smartworkspace.enums.FeedbackStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(FeedbackStatus status);
}
