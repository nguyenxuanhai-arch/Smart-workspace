package com.example.smartworkspace.configs;

import java.net.URI;
import java.net.URISyntaxException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentCallbackUrlResolver {

    private final AppUrlProperties appUrlProperties;

    public String resolve(HttpServletRequest request) {
        String requestOrigin = normalizeOrigin(request.getHeader("Origin"));
        if (requestOrigin != null && hasSameHost(requestOrigin, request.getServerName())) {
            return requestOrigin;
        }

        String configuredOrigin = normalizeOrigin(appUrlProperties.getFrontendUrl());
        if (configuredOrigin == null) {
            throw new IllegalStateException("APP_FRONTEND_URL must be an absolute HTTP(S) origin");
        }
        return configuredOrigin;
    }

    private boolean hasSameHost(String origin, String requestHost) {
        if (requestHost == null || requestHost.isBlank()) {
            return false;
        }
        return URI.create(origin).getHost().equalsIgnoreCase(requestHost);
    }

    private String normalizeOrigin(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            URI uri = new URI(value.trim());
            String scheme = uri.getScheme();
            if (scheme == null
                    || (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme))
                    || uri.getHost() == null
                    || uri.getUserInfo() != null
                    || uri.getQuery() != null
                    || uri.getFragment() != null
                    || (uri.getPath() != null && !uri.getPath().isBlank() && !"/".equals(uri.getPath()))) {
                return null;
            }

            return new URI(
                    scheme.toLowerCase(),
                    null,
                    uri.getHost().toLowerCase(),
                    uri.getPort(),
                    null,
                    null,
                    null
            ).toString();
        } catch (URISyntaxException | IllegalArgumentException ex) {
            return null;
        }
    }
}
