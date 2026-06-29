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
                .andReturn();

        JsonNode loginData = responseData(loginResult);
        String firstAccessToken = loginData.get("accessToken").asText();
        String firstRefreshToken = loginData.get("refreshToken").asText();
        assertThat(firstAccessToken).isNotBlank();
        assertThat(firstRefreshToken).isNotBlank();

        String firstRefreshHash = hashToken(firstRefreshToken);
        assertThat(refreshTokenRepository.findByTokenHashAndRevokedFalse(firstRefreshHash))
                .isPresent()
                .get()
                .satisfies(refreshToken -> assertThat(refreshToken.getTokenHash()).isNotEqualTo(firstRefreshToken));

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + firstAccessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value(email));

        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("refreshToken", firstRefreshToken))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Refresh token successfully"))
                .andReturn();

        JsonNode refreshData = responseData(refreshResult);
        String secondAccessToken = refreshData.get("accessToken").asText();
        String secondRefreshToken = refreshData.get("refreshToken").asText();
        assertThat(secondAccessToken).isNotEqualTo(firstAccessToken);
        assertThat(secondRefreshToken).isNotEqualTo(firstRefreshToken);
        assertThat(refreshTokenRepository.findByTokenHashAndRevokedFalse(firstRefreshHash)).isEmpty();
        assertThat(refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(secondRefreshToken))).isPresent();
        assertThat(refreshTokenRepository.findAll())
                .anySatisfy(refreshToken -> {
                    assertThat(refreshToken.getTokenHash()).isEqualTo(firstRefreshHash);
                    assertThat(refreshToken.isRevoked()).isTrue();
                });

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("refreshToken", firstRefreshToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer " + secondAccessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("refreshToken", secondRefreshToken))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successfully"));

        assertThat(refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(secondRefreshToken))).isEmpty();
        assertThat(blacklistedTokenRepository.existsByJti(jwtService.extractJti(secondAccessToken))).isTrue();

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + secondAccessToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("refreshToken", secondRefreshToken))))
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
                .content(json(Map.of("email", email, "password", password))));
    }

    private byte[] json(Object value) throws Exception {
        return objectMapper.writeValueAsBytes(value);
    }

    private JsonNode responseData(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsByteArray()).get("data");
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
