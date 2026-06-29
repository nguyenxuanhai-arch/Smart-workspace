package com.example.smartworkspace.dtos.review;

import com.example.smartworkspace.enums.VisibilityStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewStatusUpdateRequest {
    @NotNull(message = "Review status is required")
    private VisibilityStatus status;
}
