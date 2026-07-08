package com.example.smartworkspace.mappers;

import com.example.smartworkspace.dtos.address.AddressResponse;
import com.example.smartworkspace.entities.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    public AddressResponse toResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .receiverName(address.getReceiverName())
                .receiverPhone(address.getReceiverPhone())
                .provinceName(address.getProvinceName())
                .provinceCode(address.getProvinceCode())
                .wardName(address.getWardName())
                .wardCode(address.getWardCode())
                .detailAddress(address.getDetailAddress())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }
}
