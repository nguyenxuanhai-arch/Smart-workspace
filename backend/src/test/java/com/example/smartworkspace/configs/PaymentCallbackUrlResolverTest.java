package com.example.smartworkspace.configs;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class PaymentCallbackUrlResolverTest {

    @Test
    void usesCurrentBrowserOriginWhenHostMatchesRequest() {
        AppUrlProperties properties = new AppUrlProperties();
        properties.setFrontendUrl("http://configured.example");
        PaymentCallbackUrlResolver resolver = new PaymentCallbackUrlResolver(properties);
        MockHttpServletRequest request = request("85.211.242.22", "https://85.211.242.22");

        assertThat(resolver.resolve(request)).isEqualTo("https://85.211.242.22");
    }

    @Test
    void keepsFrontendPortForLocalDevelopment() {
        AppUrlProperties properties = new AppUrlProperties();
        PaymentCallbackUrlResolver resolver = new PaymentCallbackUrlResolver(properties);
        MockHttpServletRequest request = request("localhost", "http://localhost:5173");

        assertThat(resolver.resolve(request)).isEqualTo("http://localhost:5173");
    }

    @Test
    void rejectsDifferentOriginHostAndFallsBackToConfiguration() {
        AppUrlProperties properties = new AppUrlProperties();
        properties.setFrontendUrl("https://shop.example.com/");
        PaymentCallbackUrlResolver resolver = new PaymentCallbackUrlResolver(properties);
        MockHttpServletRequest request = request("shop.example.com", "https://attacker.example");

        assertThat(resolver.resolve(request)).isEqualTo("https://shop.example.com");
    }

    @Test
    void rejectsInvalidConfiguredFallback() {
        AppUrlProperties properties = new AppUrlProperties();
        properties.setFrontendUrl("not-a-url");
        PaymentCallbackUrlResolver resolver = new PaymentCallbackUrlResolver(properties);
        MockHttpServletRequest request = request("shop.example.com", null);

        assertThatThrownBy(() -> resolver.resolve(request))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("APP_FRONTEND_URL");
    }

    private MockHttpServletRequest request(String serverName, String origin) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServerName(serverName);
        if (origin != null) {
            request.addHeader("Origin", origin);
        }
        return request;
    }
}
