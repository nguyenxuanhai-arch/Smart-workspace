package com.example.smartworkspace.configs;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI smartWorkspaceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Workspace API")
                        .description("REST API for Smart Workspace e-commerce backend")
                        .version("v1"));
    }
}
