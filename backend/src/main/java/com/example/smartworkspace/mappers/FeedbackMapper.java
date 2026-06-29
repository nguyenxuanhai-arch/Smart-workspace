package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.feedback.FeedbackResponse;
import com.example.smartworkspace.entities.Feedback;
import org.springframework.stereotype.Component;

@Component
public class FeedbackMapper {
    public FeedbackResponse toResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .fullName(feedback.getFullName())
                .email(feedback.getEmail())
                .phone(feedback.getPhone())
                .subject(feedback.getSubject())
                .message(feedback.getMessage())
                .status(feedback.getStatus())
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}
