package com.example.smartworkspace.configs;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppUrlProperties {
    private String frontendUrl = "http://localhost:5173";
    private String publicApiUrl = "http://localhost:8080";
}
