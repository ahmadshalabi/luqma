package app.luqma.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for mock mode behavior.
 * 
 * <p>Controls latency simulation and error injection for MockSpoonacularClient.
 * Only active when the "mock" profile is enabled.
 */
@Data
@Component
@Profile("mock")
@ConfigurationProperties(prefix = "mock")
public class MockProperties {
    
    private Latency latency = new Latency();
    private Errors errors = new Errors();
    
    /**
     * Latency simulation configuration.
     */
    @Data
    public static class Latency {
        /**
         * Whether latency simulation is enabled.
         * Default: true
         */
        private boolean enabled = true;
        
        /**
         * Minimum latency in milliseconds.
         * Default: 100ms
         */
        private int minMillis = 100;
        
        /**
         * Maximum latency in milliseconds.
         * Default: 500ms
         */
        private int maxMillis = 500;
    }
    
    /**
     * Error injection configuration.
     */
    @Data
    public static class Errors {
        /**
         * Whether error injection is enabled.
         * Default: false
         */
        private boolean enabled = false;
        
        /**
         * Error rate (0.0 to 1.0).
         * For example, 0.1 means 10% of requests will fail.
         * Default: 0.0 (no errors)
         */
        private double rate = 0.0;
    }
}

