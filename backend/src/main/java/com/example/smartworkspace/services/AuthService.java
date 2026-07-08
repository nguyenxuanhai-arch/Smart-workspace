package com.example.smartworkspace.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Locale;
import java.util.Set;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.auth.AuthUserResponse;
import com.example.smartworkspace.dtos.auth.LoginRequest;
import com.example.smartworkspace.dtos.auth.LoginResponse;
import com.example.smartworkspace.dtos.auth.LogoutRequest;
import com.example.smartworkspace.dtos.auth.RefreshTokenRequest;
import com.example.smartworkspace.dtos.auth.RegisterRequest;
import com.example.smartworkspace.dtos.auth.RegisterResponse;
import com.example.smartworkspace.entities.BlacklistedToken;
import com.example.smartworkspace.entities.RefreshToken;
import com.example.smartworkspace.entities.Role;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.RoleName;
import com.example.smartworkspace.enums.UserStatus;
import com.example.smartworkspace.mappers.UserMapper;
import com.example.smartworkspace.repositories.BlacklistedTokenRepository;
import com.example.smartworkspace.repositories.RefreshTokenRepository;
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
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final String TOKEN_TYPE = "Bearer";
    private static final String BEARER_PREFIX = "Bearer ";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final SecureRandom secureRandom = new SecureRandom();

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

    @Transactional
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
        return buildLoginResponse(userDetails);
    }

    @Transactional
    public LoginResponse refresh(RefreshTokenRequest request) {
        return refresh(request.getRefreshToken());
    }

    @Transactional
    public LoginResponse refresh(String rawRefreshToken) {
        RefreshToken refreshToken = getUsableRefreshToken(rawRefreshToken);
        revokeRefreshToken(refreshToken);
        return buildLoginResponse(new CustomUserDetails(refreshToken.getUser()));
    }

    @Transactional
    public void logout(LogoutRequest request, String authorizationHeader) {
        logout(request.getRefreshToken(), resolveAccessToken(authorizationHeader));
    }

    @Transactional
    public void logout(String rawRefreshToken, String accessToken) {
        RefreshToken refreshToken = null;
        if (StringUtils.hasText(rawRefreshToken)) {
            refreshToken = getUsableRefreshToken(rawRefreshToken);
        }

        if (refreshToken != null && StringUtils.hasText(accessToken)) {
            String accessTokenEmail = jwtService.extractUsername(accessToken);
            if (accessTokenEmail != null && !accessTokenEmail.equals(refreshToken.getUser().getEmail())) {
                throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
            }
        }

        if (refreshToken != null) {
            revokeRefreshToken(refreshToken);
        }

        if (StringUtils.hasText(accessToken)) {
            blacklistAccessToken(accessToken);
        }

        // With HTTP-only cookies, both tokens may be absent (expired cookies).
        // Logout should succeed gracefully in this case.
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

    private LoginResponse buildLoginResponse(CustomUserDetails userDetails) {
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = createRefreshToken(userDetails.getUser());
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(TOKEN_TYPE)
                .expiresIn(jwtService.getAccessTokenExpirationMs() / 1000)
                .user(userMapper.toAuthUserResponse(userDetails.getUser()))
                .build();
    }

    private String createRefreshToken(User user) {
        String rawToken = generateRawRefreshToken();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.getReferenceById(user.getId()));
        refreshToken.setTokenHash(hashToken(rawToken));
        refreshToken.setRevoked(false);
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(jwtService.getRefreshTokenExpirationMs() / 1000));
        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    private RefreshToken getUsableRefreshToken(String rawToken) {
        if (!StringUtils.hasText(rawToken)) {
            throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(rawToken))
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REFRESH_TOKEN));
        if (!refreshToken.getExpiresAt().isAfter(LocalDateTime.now())) {
            revokeRefreshToken(refreshToken);
            throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        return refreshToken;
    }

    private void revokeRefreshToken(RefreshToken refreshToken) {
        refreshToken.setRevoked(true);
        refreshToken.setRevokedAt(LocalDateTime.now());
    }

    private void blacklistAccessToken(String accessToken) {
        if (!StringUtils.hasText(accessToken)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        String jti = jwtService.extractJti(accessToken);
        LocalDateTime expiresAt = jwtService.extractExpiresAt(accessToken);
        if (jti == null || expiresAt == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (!expiresAt.isAfter(LocalDateTime.now()) || blacklistedTokenRepository.existsByJti(jti)) {
            return;
        }

        BlacklistedToken blacklistedToken = new BlacklistedToken();
        blacklistedToken.setJti(jti);
        blacklistedToken.setExpiresAt(expiresAt);
        blacklistedTokenRepository.save(blacklistedToken);
    }

    private String resolveAccessToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            return null;
        }
        return authorizationHeader.substring(BEARER_PREFIX.length());
    }

    private String generateRawRefreshToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(hashedBytes.length * 2);
            for (byte hashedByte : hashedBytes) {
                builder.append(String.format("%02x", hashedByte));
            }
            return builder.toString();
        } catch (Exception exception) {
            throw new IllegalStateException("Could not hash token", exception);
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
