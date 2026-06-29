package com.example.smartworkspace.dtos.policy;

import java.time.LocalDateTime;

import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.enums.PolicyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyResponse {
    private Long id;
    private PolicyType type;
    private String title;
    private String content;
    private CommonStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
