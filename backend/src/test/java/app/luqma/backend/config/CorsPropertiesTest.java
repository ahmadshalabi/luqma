package app.luqma.backend.config;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for CorsProperties configuration validation.
 */
class CorsPropertiesTest {
    
    private Validator validator;
    
    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }
    
    @Test
    void validProperties_noViolations() {
        CorsProperties properties = new CorsProperties();
        properties.setAllowedOrigins(List.of("http://localhost:3000"));
        properties.setAllowedMethods(List.of("GET", "POST"));
        properties.setAllowedHeaders(List.of("Content-Type"));
        properties.setAllowCredentials(false);
        properties.setMaxAge(3600);
        
        Set<ConstraintViolation<CorsProperties>> violations = validator.validate(properties);
        
        assertThat(violations).isEmpty();
    }
    
    @Test
    void allowedOrigins_null_hasViolation() {
        CorsProperties properties = new CorsProperties();
        properties.setAllowedOrigins(null);
        properties.setAllowedMethods(List.of("GET"));
        properties.setAllowedHeaders(List.of("Content-Type"));
        
        Set<ConstraintViolation<CorsProperties>> violations = validator.validate(properties);
        
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().contains("allowed origins must not be null"));
    }
    
    @Test
    void allowedOrigins_empty_hasViolation() {
        CorsProperties properties = new CorsProperties();
        properties.setAllowedOrigins(new ArrayList<>());
        properties.setAllowedMethods(List.of("GET"));
        properties.setAllowedHeaders(List.of("Content-Type"));
        
        Set<ConstraintViolation<CorsProperties>> violations = validator.validate(properties);
        
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().contains("allowed origins must not be empty"));
    }
    
    @Test
    void allowedMethods_null_hasViolation() {
        CorsProperties properties = new CorsProperties();
        properties.setAllowedOrigins(List.of("http://localhost:3000"));
        properties.setAllowedMethods(null);
        properties.setAllowedHeaders(List.of("Content-Type"));
        
        Set<ConstraintViolation<CorsProperties>> violations = validator.validate(properties);
        
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().contains("allowed methods must not be null"));
    }
    
    @Test
    void allowedHeaders_empty_hasViolation() {
        CorsProperties properties = new CorsProperties();
        properties.setAllowedOrigins(List.of("http://localhost:3000"));
        properties.setAllowedMethods(List.of("GET"));
        properties.setAllowedHeaders(new ArrayList<>());
        
        Set<ConstraintViolation<CorsProperties>> violations = validator.validate(properties);
        
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getMessage().contains("allowed headers must not be empty"));
    }
}

