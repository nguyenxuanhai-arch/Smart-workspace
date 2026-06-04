package com.example.smartworkspace.services;

import java.util.Locale;
import java.util.Set;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.auth.AuthUserResponse;
import com.example.smartworkspace.dtos.auth.LoginRequest;
import com.example.smartworkspace.dtos.auth.LoginResponse;
import com.example.smartworkspace.dtos.auth.RegisterRequest;
import com.example.smartworkspace.dtos.auth.RegisterResponse;
import com.example.smartworkspace.entities.Role;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.RoleName;
import com.example.smartworkspace.enums.UserStatus;
import com.example.smartworkspace.mappers.UserMapper;
import com.example.smartworkspace.repositories.RoleRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import com.example.smartworkspace.securities.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final String TOKEN_TYPE = "Bearer";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        String phone = request.getPhone().trim();

        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByPhone(phone)) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        Role customerRole = roleRepository.findByName(RoleName.CUSTOMER)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        user.setRoles(Set.of(customerRole));

        return userMapper.toRegisterResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (AuthenticationException exception) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "Invalid email or password");
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return LoginResponse.builder()
                .accessToken(jwtService.generateToken(userDetails))
                .tokenType(TOKEN_TYPE)
                .user(userMapper.toAuthUserResponse(userDetails.getUser()))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthUserResponse getMe() {
        return userMapper.toAuthUserResponse(getCurrentUserDetails().getUser());
    }

    private CustomUserDetails getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return userDetails;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
