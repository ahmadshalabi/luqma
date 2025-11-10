package app.luqma.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger configuration.
 * Limits API documentation to only expose REST API classes (DTOs and controllers).
 * Internal domain models are excluded from documentation.
 */
@Configuration
public class OpenApiConfig {

    /**
     * Configures the main OpenAPI documentation.
     * Only includes classes in controller and dto packages.
     *
     * @return OpenAPI configuration
     */
    @Bean
    public OpenAPI luqmaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Luqma Recipe Search API")
                        .description("""
                                REST API for searching recipes with nutritional information.
                               \s
                                **Features:**
                                - Recipe search with pagination
                                - Detailed recipe information
                                - Nutritional data with macronutrient breakdown
                                - Rate limiting protection
                               \s
                                **Note:** This API documentation only shows public REST API models.\s
                                Internal domain models are excluded for security and clarity.
                               \s""")
                        .version("v1")
                        .contact(new Contact()
                                .name("Luqma Team")
                                .email("support@luqma.app"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development server"),
                        new Server()
                                .url("https://api.luqma.app")
                                .description("Production server")
                ));
    }

    /**
     * Groups API endpoints for better organization.
     * Only scans controller package to exclude internal implementations.
     *
     * @return Grouped API configuration
     */
    @Bean
    public GroupedOpenApi recipeApi() {
        return GroupedOpenApi.builder()
                .group("recipe-api")
                .pathsToMatch("/api/v1/**")
                .packagesToScan("app.luqma.backend.controller", "app.luqma.backend.model.dto")
                .packagesToExclude("app.luqma.backend.model.domain")
                .build();
    }

    /**
     * Health and monitoring endpoints group (separate from main API).
     *
     * @return Grouped API configuration for actuator endpoints
     */
    @Bean
    public GroupedOpenApi actuatorApi() {
        return GroupedOpenApi.builder()
                .group("actuator")
                .pathsToMatch("/actuator/**")
                .build();
    }

}

