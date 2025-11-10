package app.luqma.backend.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Configuration properties for Spoonacular API integration.
 * 
 * <p>Binds to properties prefixed with {@code spoonacular} in application.yaml.
 * All properties are validated on application startup using Jakarta Bean Validation.
 * 
 * @see SpoonacularConfig
 */
@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "spoonacular")
public class SpoonacularProperties {
    
    /**
     * Base URL for Spoonacular API.
     * Default: https://api.spoonacular.com
     */
    @NotBlank(message = "Spoonacular API URL must not be blank")
    private String apiUrl;
    
    /**
     * API key for Spoonacular API authentication.
     * Must be provided via environment variable SPOONACULAR_API_KEY.
     * 
     * <p><strong>Security Note:</strong> Never commit API keys to version control.
     */
    @NotBlank(message = "Spoonacular API key must not be blank. Set SPOONACULAR_API_KEY environment variable.")
    private String apiKey;
    
    /**
     * Connection timeout in milliseconds.
     * Default: 10000ms (10 seconds)
     */
    @Positive(message = "Connection timeout must be positive")
    private int connectionTimeout = 10000;
    
    /**
     * Read timeout in milliseconds.
     * Default: 30000ms (30 seconds)
     */
    @Positive(message = "Read timeout must be positive")
    private int readTimeout = 30000;
}

