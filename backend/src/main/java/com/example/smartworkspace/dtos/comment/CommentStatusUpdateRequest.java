package com.example.smartworkspace.dtos.comment;

import com.example.smartworkspace.enums.VisibilityStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentStatusUpdateRequest {
    @NotNull(message = "Comment status is required")
    private VisibilityStatus status;
}
