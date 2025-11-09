package app.luqma.backend.config;

import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

/**
 * Configuration properties for rate limiting.
 * Binds to rate-limit.* properties in application.yaml.
 */
@Data
@Component
@Validated
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {
    
    /**
     * Maximum number of requests allowed per time window.
     */
    @Min(value = 1, message = "Max requests must be at least 1")
    private int maxRequestsPerMinute = 100;
    
    /**
     * Time window size in milliseconds.
     */
    @Min(value = 1000, message = "Window size must be at least 1000ms")
    private long windowSizeMillis = 60_000; // 1 minute
    
    /**
     * Maximum number of IP entries to keep in memory before cleanup.
     */
    @Min(value = 100, message = "Max entries must be at least 100")
    private int maxEntries = 10_000;
    
    /**
     * Interval in milliseconds for scheduled cleanup of old entries.
     */
    @Min(value = 10_000, message = "Cleanup interval must be at least 10000ms")
    private long cleanupIntervalMillis = 300_000; // 5 minutes
}

