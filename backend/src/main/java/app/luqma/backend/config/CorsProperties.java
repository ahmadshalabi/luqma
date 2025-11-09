package app.luqma.backend.config;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.util.List;

/**
 * Configuration properties for CORS settings.
 * Binds to cors.* properties in application.yaml.
 */
@Data
@Component
@Validated
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {
    
    @NotNull(message = "CORS allowed origins must not be null")
    @NotEmpty(message = "CORS allowed origins must not be empty")
    private List<String> allowedOrigins;
    
    @NotNull(message = "CORS allowed methods must not be null")
    @NotEmpty(message = "CORS allowed methods must not be empty")
    private List<String> allowedMethods;
    
    @NotNull(message = "CORS allowed headers must not be null")
    @NotEmpty(message = "CORS allowed headers must not be empty")
    private List<String> allowedHeaders;
    
    private boolean allowCredentials;
    private long maxAge;
}

