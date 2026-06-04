package com.example.smartworkspace.controllers;

import java.util.List;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.address.AddressRequest;
import com.example.smartworkspace.dtos.address.AddressResponse;
import com.example.smartworkspace.dtos.user.UserProfileResponse;
import com.example.smartworkspace.dtos.user.UserUpdateRequest;
import com.example.smartworkspace.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ApiResponse<UserProfileResponse> getMyProfile() {
        return ApiResponse.success(userService.getMyProfile());
    }

    @PutMapping
    public ApiResponse<UserProfileResponse> updateMyProfile(@Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.success("Update profile successfully", userService.updateMyProfile(request));
    }

    @GetMapping("/addresses")
    public ApiResponse<List<AddressResponse>> getMyAddresses() {
        return ApiResponse.success(userService.getMyAddresses());
    }

    @PostMapping("/addresses")
    public ApiResponse<AddressResponse> createMyAddress(@Valid @RequestBody AddressRequest request) {
        return ApiResponse.success("Create address successfully", userService.createMyAddress(request));
    }

    @PutMapping("/addresses/{id}")
    public ApiResponse<AddressResponse> updateMyAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request
    ) {
        return ApiResponse.success("Update address successfully", userService.updateMyAddress(id, request));
    }

    @DeleteMapping("/addresses/{id}")
    public ApiResponse<Void> deleteMyAddress(@PathVariable Long id) {
        userService.deleteMyAddress(id);
        return ApiResponse.success("Delete address successfully");
    }
}
