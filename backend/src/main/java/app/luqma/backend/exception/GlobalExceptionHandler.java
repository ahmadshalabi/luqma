package app.luqma.backend.exception;

import app.luqma.backend.util.StringSanitizer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

/**
 * Global exception handler for all REST controllers.
 * Provides centralized error handling with user-friendly messages and proper logging.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * Handles invalid pagination exceptions (400 Bad Request).
     * 
     * @param ex the pagination exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(InvalidPaginationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPaginationException(
            InvalidPaginationException ex, HttpServletRequest request) {
        
        log.warn("Invalid pagination parameters: {} - Path: {}, Query: {}", 
                ex.getMessage(), request.getRequestURI(), StringSanitizer.sanitizeQueryString(request.getQueryString()));
        
        return ErrorResponseBuilder.build(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }
    
    /**
     * Handles resource not found exceptions (404 Not Found).
     * 
     * @param ex the resource not found exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {
        
        log.warn("Resource not found: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        
        return ErrorResponseBuilder.build(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }
    
    /**
     * Handles resource loading exceptions (500 Internal Server Error).
     * 
     * @param ex the resource load exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(ResourceLoadException.class)
    public ResponseEntity<ErrorResponse> handleResourceLoadException(
            ResourceLoadException ex, HttpServletRequest request) {
        
        log.error("Resource loading failed: {} - Path: {}", ex.getMessage(), request.getRequestURI(), ex);
        
        return ErrorResponseBuilder.build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An error occurred while processing your request. Please try again later.",
                request
        );
    }
    
    /**
     * Handles validation exceptions from @Valid annotations (400 Bad Request).
     * 
     * @param ex the method argument validation exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining("; "));
        
        log.warn("Validation failed: {} - Path: {}, Query: {}", 
                errorMessage, request.getRequestURI(), StringSanitizer.sanitizeQueryString(request.getQueryString()));
        
        return ErrorResponseBuilder.build(HttpStatus.BAD_REQUEST, errorMessage, request);
    }
    
    /**
     * Handles constraint violation exceptions (400 Bad Request).
     * 
     * @param ex the constraint violation exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException ex, HttpServletRequest request) {
        
        String errorMessage = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining("; "));
        
        log.warn("Constraint violation: {} - Path: {}, Query: {}", 
                errorMessage, request.getRequestURI(), StringSanitizer.sanitizeQueryString(request.getQueryString()));
        
        return ErrorResponseBuilder.build(HttpStatus.BAD_REQUEST, errorMessage, request);
    }
    
    /**
     * Handles missing request parameter exceptions (400 Bad Request).
     * 
     * @param ex the missing parameter exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException ex, HttpServletRequest request) {
        
        String errorMessage = String.format("Required parameter '%s' is missing", ex.getParameterName());
        
        log.warn("Missing required parameter: {} - Path: {}", errorMessage, request.getRequestURI());
        
        return ErrorResponseBuilder.build(HttpStatus.BAD_REQUEST, errorMessage, request);
    }
    
    /**
     * Handles type mismatch exceptions (400 Bad Request).
     * 
     * @param ex the type mismatch exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        
        String errorMessage = String.format("Invalid value '%s' for parameter '%s'", ex.getValue(), ex.getName());
        
        log.warn("Type mismatch: {} - Path: {}", errorMessage, request.getRequestURI());
        
        return ErrorResponseBuilder.build(HttpStatus.BAD_REQUEST, errorMessage, request);
    }
    
    /**
     * Handles external API exceptions (503 Service Unavailable or 429 Too Many Requests).
     * Maps different external API error types to appropriate HTTP status codes.
     * 
     * @param ex the external API exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ErrorResponse> handleExternalApiException(
            ExternalApiException ex, HttpServletRequest request) {
        
        HttpStatus status;
        String message;
        
        if (ex.isRateLimitError()) {
            status = HttpStatus.TOO_MANY_REQUESTS;
            message = "Too many requests. Please try again later.";
            log.warn("Rate limit exceeded for {} - Path: {}", ex.getServiceName(), request.getRequestURI());
        } else if (ex.isNetworkError()) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = "External service temporarily unavailable. Please try again later.";
            log.error("Network error calling {} - Path: {}", ex.getServiceName(), request.getRequestURI(), ex);
        } else if (ex.isServerError()) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = "External service error. Please try again later.";
            log.error("Server error from {} (status: {}) - Path: {}", 
                    ex.getServiceName(), ex.getStatusCode(), request.getRequestURI(), ex);
        } else {
            status = HttpStatus.BAD_GATEWAY;
            message = "Error communicating with external service. Please try again later.";
            log.error("External API error from {} (status: {}) - Path: {}", 
                    ex.getServiceName(), ex.getStatusCode(), request.getRequestURI(), ex);
        }
        
        return ErrorResponseBuilder.build(status, message, request);
    }
    
    /**
     * Handles all other unhandled exceptions (500 Internal Server Error).
     * 
     * @param ex the unhandled exception
     * @param request the HTTP servlet request
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {
        
        log.error("Unexpected error occurred - Path: {}, Method: {}, Query: {}", 
                request.getRequestURI(), request.getMethod(), StringSanitizer.sanitizeQueryString(request.getQueryString()), ex);
        
        return ErrorResponseBuilder.build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.",
                request
        );
    }
}

