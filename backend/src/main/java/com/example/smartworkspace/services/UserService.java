package com.example.smartworkspace.services;

import java.util.List;
import java.util.Objects;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.address.AddressRequest;
import com.example.smartworkspace.dtos.address.AddressResponse;
import com.example.smartworkspace.dtos.user.UserProfileResponse;
import com.example.smartworkspace.dtos.user.UserUpdateRequest;
import com.example.smartworkspace.entities.Address;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.mappers.AddressMapper;
import com.example.smartworkspace.mappers.UserMapper;
import com.example.smartworkspace.repositories.AddressRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final UserMapper userMapper;
    private final AddressMapper addressMapper;

    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile() {
        return userMapper.toProfileResponse(getCurrentUser());
    }

    @Transactional
    public UserProfileResponse updateMyProfile(UserUpdateRequest request) {
        User user = getCurrentUser();
        String phone = trim(request.getPhone());

        if (userRepository.existsByPhoneAndIdNot(phone, user.getId())) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        user.setFullName(trim(request.getFullName()));
        user.setPhone(phone);
        return userMapper.toProfileResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses() {
        Long userId = getCurrentUserId();
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId).stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    @Transactional
    public AddressResponse createMyAddress(AddressRequest request) {
        User user = getCurrentUser();
        Address address = new Address();
        address.setUser(user);
        applyAddressRequest(address, request);

        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault())
                || addressRepository.countByUserId(user.getId()) == 0;
        address.setIsDefault(shouldBeDefault);
        if (shouldBeDefault) {
            unsetOtherDefaultAddresses(user.getId(), null);
        }

        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateMyAddress(Long addressId, AddressRequest request) {
        Long userId = getCurrentUserId();
        Address address = getMyAddressEntity(addressId, userId);

        applyAddressRequest(address, request);
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
            if (Boolean.TRUE.equals(request.getIsDefault())) {
                unsetOtherDefaultAddresses(userId, addressId);
            }
        }

        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Transactional
    public void deleteMyAddress(Long addressId) {
        Long userId = getCurrentUserId();
        Address address = getMyAddressEntity(addressId, userId);
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());

        List<Address> remainingAddresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .filter(item -> !Objects.equals(item.getId(), addressId))
                .toList();

        addressRepository.delete(address);
        if (wasDefault && !remainingAddresses.isEmpty()) {
            Address nextDefault = remainingAddresses.get(0);
            nextDefault.setIsDefault(true);
            addressRepository.save(nextDefault);
        }
    }

    private Address getMyAddressEntity(Long addressId, Long userId) {
        return addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
    }

    private User getCurrentUser() {
        Long userId = getCurrentUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return userDetails.getUser().getId();
    }

    private void applyAddressRequest(Address address, AddressRequest request) {
        address.setReceiverName(trim(request.getReceiverName()));
        address.setReceiverPhone(trim(request.getReceiverPhone()));
        address.setProvinceName(trim(request.getProvinceName()));
        address.setProvinceCode(request.getProvinceCode());
        address.setWardName(trim(request.getWardName()));
        address.setWardCode(request.getWardCode());
        address.setDetailAddress(trim(request.getDetailAddress()));
    }

    private void unsetOtherDefaultAddresses(Long userId, Long excludedAddressId) {
        List<Address> defaultAddresses = addressRepository.findByUserId(userId).stream()
                .filter(address -> Boolean.TRUE.equals(address.getIsDefault()))
                .filter(address -> excludedAddressId == null || !Objects.equals(address.getId(), excludedAddressId))
                .toList();

        defaultAddresses.forEach(address -> address.setIsDefault(false));
        addressRepository.saveAll(defaultAddresses);
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
