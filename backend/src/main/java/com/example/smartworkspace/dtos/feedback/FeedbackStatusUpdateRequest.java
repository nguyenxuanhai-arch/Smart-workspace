package com.example.smartworkspace.dtos.feedback;

import com.example.smartworkspace.enums.FeedbackStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackStatusUpdateRequest {
    @NotNull(message = "Feedback status is required")
    private FeedbackStatus status;
}
