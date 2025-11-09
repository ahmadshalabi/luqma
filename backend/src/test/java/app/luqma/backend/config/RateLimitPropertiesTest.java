package app.luqma.backend.config;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for RateLimitProperties configuration validation.
 */
class RateLimitPropertiesTest {
    
    private Validator validator;
    
    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }
    
    @Test
    void validProperties_noViolations() {
        // Given
        RateLimitProperties properties = new RateLimitProperties();
        properties.setMaxRequestsPerMinute(100);
        properties.setWindowSizeMillis(60000);
        properties.setMaxEntries(10000);
        properties.setCleanupIntervalMillis(300000);
        
        // When
        Set<ConstraintViolation<RateLimitProperties>> violations = validator.validate(properties);
        
        // Then
        assertThat(violations).isEmpty();
    }
    
    @Test
    void maxRequestsPerMinute_lessThanOne_hasViolation() {
        // Given
        RateLimitProperties properties = new RateLimitProperties();
        properties.setMaxRequestsPerMinute(0);
        
        // When
        Set<ConstraintViolation<RateLimitProperties>> violations = validator.validate(properties);
        
        // Then
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Max requests must be at least 1"));
    }
    
    @Test
    void windowSizeMillis_lessThan1000_hasViolation() {
        // Given
        RateLimitProperties properties = new RateLimitProperties();
        properties.setWindowSizeMillis(999);
        
        // When
        Set<ConstraintViolation<RateLimitProperties>> violations = validator.validate(properties);
        
        // Then
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Window size must be at least 1000ms"));
    }
    
    @Test
    void maxEntries_lessThan100_hasViolation() {
        // Given
        RateLimitProperties properties = new RateLimitProperties();
        properties.setMaxEntries(99);
        
        // When
        Set<ConstraintViolation<RateLimitProperties>> violations = validator.validate(properties);
        
        // Then
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Max entries must be at least 100"));
    }
    
    @Test
    void cleanupIntervalMillis_lessThan10000_hasViolation() {
        // Given
        RateLimitProperties properties = new RateLimitProperties();
        properties.setCleanupIntervalMillis(9999);
        
        // When
        Set<ConstraintViolation<RateLimitProperties>> violations = validator.validate(properties);
        
        // Then
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().contains("Cleanup interval must be at least 10000ms"));
    }
}

