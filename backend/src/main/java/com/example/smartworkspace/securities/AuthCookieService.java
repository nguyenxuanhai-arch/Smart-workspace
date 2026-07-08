package com.example.smartworkspace.securities;

import java.time.Duration;
import java.util.Arrays;

import com.example.smartworkspace.dtos.auth.LoginResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class AuthCookieService {
    public static final String AUTH_CONTEXT_HEADER = "X-Auth-Context";
    private static final String ADMIN_CONTEXT = "admin";
    private static final String CLIENT_CONTEXT = "client";
    private static final String ACCESS_COOKIE_SUFFIX = "_access_token";
    private static final String REFRESH_COOKIE_SUFFIX = "_refresh_token";
    private static final String COOKIE_PREFIX = "sw_";
    private static final String COOKIE_PATH = "/";
    private static final String SAME_SITE = "Lax";

    private final JwtService jwtService;

    @Value("${app.auth.cookie.secure:false}")
    private boolean secureCookie;

    public AuthCookieService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public String resolveContext(String rawContext) {
        return ADMIN_CONTEXT.equalsIgnoreCase(rawContext) ? ADMIN_CONTEXT : CLIENT_CONTEXT;
    }

    public void addAuthCookies(HttpServletResponse response, String context, LoginResponse loginResponse) {
        String resolvedContext = resolveContext(context);
        addCookie(response, accessCookieName(resolvedContext), loginResponse.getAccessToken(), jwtService.getAccessTokenExpirationMs());
        addCookie(response, refreshCookieName(resolvedContext), loginResponse.getRefreshToken(), jwtService.getRefreshTokenExpirationMs());
    }

    public void clearAuthCookies(HttpServletResponse response, String context) {
        String resolvedContext = resolveContext(context);
        clearCookie(response, accessCookieName(resolvedContext));
        clearCookie(response, refreshCookieName(resolvedContext));
    }

    public String resolveAccessToken(HttpServletRequest request) {
        String context = resolveContext(request.getHeader(AUTH_CONTEXT_HEADER));
        String token = resolveCookie(request, accessCookieName(context));
        if (StringUtils.hasText(token)) {
            return token;
        }

        return Arrays.stream(new String[] { ADMIN_CONTEXT, CLIENT_CONTEXT })
                .filter(candidate -> !candidate.equals(context))
                .map(candidate -> resolveCookie(request, accessCookieName(candidate)))
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(null);
    }

    public String resolveRefreshToken(HttpServletRequest request) {
        String context = resolveContext(request.getHeader(AUTH_CONTEXT_HEADER));
        return resolveCookie(request, refreshCookieName(context));
    }

    public LoginResponse withoutTokenPayload(LoginResponse loginResponse) {
        return LoginResponse.builder()
                .tokenType(loginResponse.getTokenType())
                .expiresIn(loginResponse.getExpiresIn())
                .user(loginResponse.getUser())
                .build();
    }

    private void addCookie(HttpServletResponse response, String name, String value, long maxAgeMs) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite(SAME_SITE)
                .path(COOKIE_PATH)
                .maxAge(Duration.ofMillis(maxAgeMs))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearCookie(HttpServletResponse response, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite(SAME_SITE)
                .path(COOKIE_PATH)
                .maxAge(Duration.ZERO)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String accessCookieName(String context) {
        return COOKIE_PREFIX + context + ACCESS_COOKIE_SUFFIX;
    }

    private String refreshCookieName(String context) {
        return COOKIE_PREFIX + context + REFRESH_COOKIE_SUFFIX;
    }

    private String resolveCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        return Arrays.stream(cookies)
                .filter(cookie -> name.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
