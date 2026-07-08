package com.example.smartworkspace;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import java.util.UUID;

import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.RoleName;
import com.example.smartworkspace.repositories.BlacklistedTokenRepository;
import com.example.smartworkspace.repositories.RefreshTokenRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthFlowIntegrationTest {
    private static final String PASSWORD = "123456";
    private static final String AUTH_CONTEXT_HEADER = "X-Auth-Context";
    private static final String AUTH_CONTEXT = "admin";
    private static final String ACCESS_COOKIE = "sw_admin_access_token";
    private static final String REFRESH_COOKIE = "sw_admin_refresh_token";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Test
    void registerLoginRefreshAndLogoutFollowTokenRules() throws Exception {
        String uniquePart = UUID.randomUUID().toString();
        String email = "auth-flow-" + uniquePart + "@smartworkspace.local";
        String phone = "09" + uniquePart.replace("-", "").substring(0, 8);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "fullName", "Auth Flow Customer",
                                "email", email,
                                "phone", phone,
                                "password", PASSWORD
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(email));

        User user = userRepository.findByEmail(email).orElseThrow();
        assertThat(user.getPasswordHash()).isNotEqualTo(PASSWORD);
        assertThat(passwordEncoder.matches(PASSWORD, user.getPasswordHash())).isTrue();
        assertThat(user.getRoles())
                .extracting(role -> role.getName())
                .containsExactly(RoleName.CUSTOMER);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", email, "password", "wrong-password"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        MvcResult loginResult = login(email, PASSWORD)
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.expiresIn").isNumber())
                .andExpect(jsonPath("$.data.user.email").value(email))
                .andExpect(jsonPath("$.data.user.roles[0]").value("CUSTOMER"))
                // Response body should NOT contain tokens (they are in cookies)
                .andExpect(jsonPath("$.data.accessToken").doesNotExist())
                .andExpect(jsonPath("$.data.refreshToken").doesNotExist())
                .andReturn();

        // Tokens should be in Set-Cookie headers
        String firstAccessToken = getCookieValue(loginResult, ACCESS_COOKIE);
        String firstRefreshToken = getCookieValue(loginResult, REFRESH_COOKIE);
        assertThat(firstAccessToken).isNotBlank();
        assertThat(firstRefreshToken).isNotBlank();

        String firstRefreshHash = hashToken(firstRefreshToken);
        assertThat(refreshTokenRepository.findByTokenHashAndRevokedFalse(firstRefreshHash))
                .isPresent()
                .get()
                .satisfies(refreshToken -> assertThat(refreshToken.getTokenHash()).isNotEqualTo(firstRefreshToken));

        // /me should work via cookie
        mockMvc.perform(get("/api/auth/me")
                        .cookie(new Cookie(ACCESS_COOKIE, firstAccessToken))
                        .header(AUTH_CONTEXT_HEADER, AUTH_CONTEXT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value(email));

        // Refresh using cookie (no body needed)
        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new Cookie(REFRESH_COOKIE, firstRefreshToken))
                        .header(AUTH_CONTEXT_HEADER, AUTH_CONTEXT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Refresh token successfully"))
                // Response body should NOT contain tokens
                .andExpect(jsonPath("$.data.accessToken").doesNotExist())
                .andExpect(jsonPath("$.data.refreshToken").doesNotExist())
                .andReturn();

        String secondAccessToken = getCookieValue(refreshResult, ACCESS_COOKIE);
        String secondRefreshToken = getCookieValue(refreshResult, REFRESH_COOKIE);
        assertThat(secondAccessToken).isNotEqualTo(firstAccessToken);
        assertThat(secondRefreshToken).isNotEqualTo(firstRefreshToken);
        assertThat(refreshTokenRepository.findByTokenHashAndRevokedFalse(firstRefreshHash)).isEmpty();
        assertThat(refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(secondRefreshToken))).isPresent();
        assertThat(refreshTokenRepository.findAll())
                .anySatisfy(refreshToken -> {
                    assertThat(refreshToken.getTokenHash()).isEqualTo(firstRefreshHash);
                    assertThat(refreshToken.isRevoked()).isTrue();
                });

        // Reusing revoked refresh token should fail
        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new Cookie(REFRESH_COOKIE, firstRefreshToken))
                        .header(AUTH_CONTEXT_HEADER, AUTH_CONTEXT))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        // Logout using cookies (no body needed)
        mockMvc.perform(post("/api/auth/logout")
                        .cookie(
                                new Cookie(ACCESS_COOKIE, secondAccessToken),
                                new Cookie(REFRESH_COOKIE, secondRefreshToken)
                        )
                        .header(AUTH_CONTEXT_HEADER, AUTH_CONTEXT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successfully"));

        assertThat(refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(secondRefreshToken))).isEmpty();
        assertThat(blacklistedTokenRepository.existsByJti(jwtService.extractJti(secondAccessToken))).isTrue();

        // Access token should be blacklisted
        mockMvc.perform(get("/api/auth/me")
                        .cookie(new Cookie(ACCESS_COOKIE, secondAccessToken))
                        .header(AUTH_CONTEXT_HEADER, AUTH_CONTEXT))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        // Refresh token should be revoked
        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new Cookie(REFRESH_COOKIE, secondRefreshToken))
                        .header(AUTH_CONTEXT_HEADER, AUTH_CONTEXT))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void meEndpointRequiresToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    private org.springframework.test.web.servlet.ResultActions login(String email, String password) throws Exception {
        return mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .header(AUTH_CONTEXT_HEADER, AUTH_CONTEXT)
                .content(json(Map.of("email", email, "password", password))));
    }

    private byte[] json(Object value) throws Exception {
        return objectMapper.writeValueAsBytes(value);
    }

    private JsonNode responseData(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsByteArray()).get("data");
    }

    private String getCookieValue(MvcResult result, String cookieName) {
        Cookie cookie = result.getResponse().getCookie(cookieName);
        assertThat(cookie).as("Cookie '%s' should be set", cookieName).isNotNull();
        return cookie.getValue();
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
}
