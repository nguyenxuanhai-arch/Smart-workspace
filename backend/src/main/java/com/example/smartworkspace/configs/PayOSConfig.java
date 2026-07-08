package com.example.smartworkspace.configs;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.payos.PayOS;

@Configuration
@EnableConfigurationProperties(PayOSProperties.class)
public class PayOSConfig {

    @Bean
    public PayOS payOS(PayOSProperties properties) {
        return new PayOS(
            properties.getClientId(),
            properties.getApiKey(),
            properties.getChecksumKey()
        );
    }
}
