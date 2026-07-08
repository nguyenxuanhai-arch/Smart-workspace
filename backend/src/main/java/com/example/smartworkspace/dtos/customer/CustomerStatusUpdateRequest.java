package com.example.smartworkspace.dtos.customer;

import com.example.smartworkspace.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerStatusUpdateRequest {
    @NotNull
    private UserStatus status;
}
