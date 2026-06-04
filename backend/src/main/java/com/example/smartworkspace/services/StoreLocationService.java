package com.example.smartworkspace.services;

import java.util.List;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.storelocation.StoreLocationRequest;
import com.example.smartworkspace.dtos.storelocation.StoreLocationResponse;
import com.example.smartworkspace.entities.StoreLocation;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.mappers.StoreLocationMapper;
import com.example.smartworkspace.repositories.StoreLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StoreLocationService {
    private final StoreLocationRepository storeLocationRepository;
    private final StoreLocationMapper storeLocationMapper;

    @Transactional(readOnly = true)
    public List<StoreLocationResponse> getActiveStoreLocations() {
        return storeLocationRepository.findByStatusOrderByIdAsc(CommonStatus.ACTIVE).stream()
                .map(storeLocationMapper::toResponse)
                .toList();
    }

    @Transactional
    public StoreLocationResponse createStoreLocation(StoreLocationRequest request) {
        StoreLocation storeLocation = new StoreLocation();
        applyRequest(storeLocation, request);
        return storeLocationMapper.toResponse(storeLocationRepository.save(storeLocation));
    }

    @Transactional
    public StoreLocationResponse updateStoreLocation(Long id, StoreLocationRequest request) {
        StoreLocation storeLocation = getStoreLocation(id);
        applyRequest(storeLocation, request);
        return storeLocationMapper.toResponse(storeLocationRepository.save(storeLocation));
    }

    @Transactional
    public void deleteStoreLocation(Long id) {
        StoreLocation storeLocation = getStoreLocation(id);
        storeLocation.setStatus(CommonStatus.INACTIVE);
        storeLocationRepository.save(storeLocation);
    }

    private StoreLocation getStoreLocation(Long id) {
        return storeLocationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_LOCATION_NOT_FOUND));
    }

    private void applyRequest(StoreLocation storeLocation, StoreLocationRequest request) {
        storeLocation.setName(trim(request.getName()));
        storeLocation.setAddress(trim(request.getAddress()));
        storeLocation.setPhone(trim(request.getPhone()));
        storeLocation.setLatitude(request.getLatitude());
        storeLocation.setLongitude(request.getLongitude());
        storeLocation.setGoogleMapUrl(trim(request.getGoogleMapUrl()));
        storeLocation.setStatus(request.getStatus() == null ? CommonStatus.ACTIVE : request.getStatus());
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
