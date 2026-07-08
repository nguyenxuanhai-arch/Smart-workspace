package com.example.smartworkspace.dtos.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    @NotBlank(message = "Receiver name is required")
    @Size(max = 150, message = "Receiver name must be at most 150 characters")
    private String receiverName;

    @NotBlank(message = "Receiver phone is required")
    @Size(max = 30, message = "Receiver phone must be at most 30 characters")
    private String receiverPhone;

    @NotBlank(message = "Province name is required")
    @Size(max = 100, message = "Province name must be at most 100 characters")
    private String provinceName;

    private Integer provinceCode;

    @NotBlank(message = "Ward name is required")
    @Size(max = 100, message = "Ward name must be at most 100 characters")
    private String wardName;

    private Integer wardCode;

    @NotBlank(message = "Detail address is required")
    @Size(max = 500, message = "Detail address must be at most 500 characters")
    private String detailAddress;

    private Boolean isDefault;
}
