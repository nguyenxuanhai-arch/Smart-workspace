package com.example.smartworkspace.repositories;

import com.example.smartworkspace.entities.Feedback;
import com.example.smartworkspace.enums.FeedbackStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    long countByStatus(FeedbackStatus status);
}
