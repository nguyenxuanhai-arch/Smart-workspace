package com.example.smartworkspace.mappers;

import java.util.Comparator;
import java.util.List;

import com.example.smartworkspace.dtos.auth.AuthUserResponse;
import com.example.smartworkspace.dtos.auth.RegisterResponse;
import com.example.smartworkspace.dtos.user.UserProfileResponse;
import com.example.smartworkspace.entities.Role;
import com.example.smartworkspace.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public RegisterResponse toRegisterResponse(User user) {
        return RegisterResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    public AuthUserResponse toAuthUserResponse(User user) {
        return AuthUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .roles(toRoleNames(user))
                .build();
    }

    public UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .roles(toRoleNames(user))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private List<String> toRoleNames(User user) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .sorted(Comparator.comparing(Enum::name))
                .map(Enum::name)
                .toList();
        return roles;
    }
}
