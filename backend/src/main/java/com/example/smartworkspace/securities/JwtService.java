package com.example.smartworkspace.securities;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class JwtService {
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final Base64.Encoder BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_URL_DECODER = Base64.getUrlDecoder();
    private static final TypeReference<Map<String, Object>> CLAIMS_TYPE = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    @Value("${app.jwt.secret}")
    private String configuredSecret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private SecretKey secretKey;

    @PostConstruct
    void initializeSecretKey() {
        byte[] secretBytes;
        if (StringUtils.hasText(configuredSecret)) {
            secretBytes = configuredSecret.getBytes(StandardCharsets.UTF_8);
        } else {
            secretBytes = new byte[32];
            new SecureRandom().nextBytes(secretBytes);
        }
        this.secretKey = new SecretKeySpec(secretBytes, HMAC_ALGORITHM);
    }

    public String generateToken(UserDetails userDetails) {
        Instant now = Instant.now();
        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("jti", UUID.randomUUID().toString());
        claims.put("sub", userDetails.getUsername());
        claims.put("iat", now.getEpochSecond());
        claims.put("exp", now.plusMillis(expirationMs).getEpochSecond());

        String encodedHeader = encodeJson(header);
        String encodedPayload = encodeJson(claims);
        String unsignedToken = encodedHeader + "." + encodedPayload;
        return unsignedToken + "." + sign(unsignedToken);
    }

    public String extractUsername(String token) {
        return parseClaims(token)
                .map(claims -> claims.get("sub"))
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .orElse(null);
    }

    public String extractJti(String token) {
        return parseClaims(token)
                .map(claims -> claims.get("jti"))
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .orElse(null);
    }

    public LocalDateTime extractExpiresAt(String token) {
        return parseClaims(token)
                .map(claims -> claims.get("exp"))
                .map(this::toLong)
                .map(expiration -> LocalDateTime.ofInstant(Instant.ofEpochSecond(expiration), ZoneId.systemDefault()))
                .orElse(null);
    }

    public long getAccessTokenExpirationMs() {
        return expirationMs;
    }

    public long getRefreshTokenExpirationMs() {
        return refreshExpirationMs;
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username != null
                && username.equals(userDetails.getUsername())
                && !isTokenExpired(token)
                && hasValidSignature(token);
    }

    private boolean isTokenExpired(String token) {
        return parseClaims(token)
                .map(claims -> claims.get("exp"))
                .map(this::toLong)
                .map(expiration -> expiration <= Instant.now().getEpochSecond())
                .orElse(true);
    }

    private Optional<Map<String, Object>> parseClaims(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3 || !hasValidSignature(token)) {
                return Optional.empty();
            }
            byte[] payloadBytes = BASE64_URL_DECODER.decode(parts[1]);
            Map<String, Object> claims = objectMapper.readValue(payloadBytes, CLAIMS_TYPE);
            return Optional.of(claims);
        } catch (Exception exception) {
            return Optional.empty();
        }
    }

    private boolean hasValidSignature(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }

        String unsignedToken = parts[0] + "." + parts[1];
        byte[] expectedSignature = sign(unsignedToken).getBytes(StandardCharsets.UTF_8);
        byte[] actualSignature = parts[2].getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(expectedSignature, actualSignature);
    }

    private String encodeJson(Map<String, Object> value) {
        try {
            return BASE64_URL_ENCODER.encodeToString(objectMapper.writeValueAsBytes(value));
        } catch (Exception exception) {
            throw new IllegalStateException("Could not encode JWT", exception);
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(secretKey);
            return BASE64_URL_ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Could not sign JWT", exception);
        }
    }

    private Long toLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String text) {
            return Long.parseLong(text);
        }
        throw new IllegalArgumentException("Invalid JWT expiration");
    }
}
