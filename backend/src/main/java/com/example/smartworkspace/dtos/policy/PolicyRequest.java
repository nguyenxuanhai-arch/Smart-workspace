package com.example.smartworkspace.dtos.policy;

import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.enums.PolicyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyRequest {
    @NotNull(message = "Policy type is required")
    private PolicyType type;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be at most 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private CommonStatus status;
}
