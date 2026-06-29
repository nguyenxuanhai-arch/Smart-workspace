package com.example.smartworkspace.dtos.storelocation;

import java.math.BigDecimal;

import com.example.smartworkspace.enums.CommonStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreLocationRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must be at most 500 characters")
    private String address;

    @Size(max = 30, message = "Phone must be at most 30 characters")
    private String phone;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Size(max = 500, message = "Google Map URL must be at most 500 characters")
    private String googleMapUrl;

    private CommonStatus status;
}
