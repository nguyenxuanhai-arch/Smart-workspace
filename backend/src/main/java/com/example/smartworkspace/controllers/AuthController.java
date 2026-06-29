package com.example.smartworkspace.controllers;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.auth.AuthUserResponse;
import com.example.smartworkspace.dtos.auth.LoginRequest;
import com.example.smartworkspace.dtos.auth.LoginResponse;
import com.example.smartworkspace.dtos.auth.LogoutRequest;
import com.example.smartworkspace.dtos.auth.RefreshTokenRequest;
import com.example.smartworkspace.dtos.auth.RegisterRequest;
import com.example.smartworkspace.dtos.auth.RegisterResponse;
import com.example.smartworkspace.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Register successfully", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successfully", authService.login(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success("Refresh token successfully", authService.refresh(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @Valid @RequestBody LogoutRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        authService.logout(request, authorizationHeader);
        return ApiResponse.success("Logout successfully", null);
    }

    @GetMapping("/me")
    public ApiResponse<AuthUserResponse> me() {
        return ApiResponse.success(authService.getMe());
    }
}
