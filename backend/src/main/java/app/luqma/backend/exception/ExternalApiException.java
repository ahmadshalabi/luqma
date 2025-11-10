package app.luqma.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

/**
 * Exception thrown when external API calls fail.
 * Wraps HTTP errors from external services (e.g., Spoonacular API).
 * 
 * <p>This exception includes the HTTP status code from the external API
 * to allow appropriate error handling and response mapping.
 * 
 * <p><strong>Common Status Codes:</strong>
 * <ul>
 *   <li>404 - Resource not found</li>
 *   <li>429 - Rate limit exceeded (too many requests)</li>
 *   <li>500+ - External server errors</li>
 *   <li>0 - Network errors (timeouts, connection failures)</li>
 * </ul>
 */
@Getter
public class ExternalApiException extends LuqmaException {
    
    /**
     * HTTP status code from the external API response.
     * May be 0 for network-level errors (timeouts, connection failures).
     */
    private final int statusCode;
    
    /**
     * Name of the external service that failed (e.g., "Spoonacular API").
     */
    private final String serviceName;
    
    /**
     * Creates a new ExternalApiException.
     * 
     * @param message human-readable error message
     * @param statusCode HTTP status code from external API (or 0 for network errors)
     * @param serviceName name of the external service
     */
    public ExternalApiException(String message, int statusCode, String serviceName) {
        super(message);
        this.statusCode = statusCode;
        this.serviceName = serviceName;
    }
    
    /**
     * Creates a new ExternalApiException with a cause.
     * 
     * @param message human-readable error message
     * @param statusCode HTTP status code from external API (or 0 for network errors)
     * @param serviceName name of the external service
     * @param cause the underlying exception
     */
    public ExternalApiException(String message, int statusCode, String serviceName, Throwable cause) {
        super(message, cause);
        this.statusCode = statusCode;
        this.serviceName = serviceName;
    }
    
    /**
     * Creates a new ExternalApiException with HttpStatusCode.
     * 
     * @param message human-readable error message
     * @param statusCode Spring HttpStatusCode from external API
     * @param serviceName name of the external service
     */
    public ExternalApiException(String message, HttpStatusCode statusCode, String serviceName) {
        this(message, statusCode.value(), serviceName);
    }
    
    /**
     * Creates a new ExternalApiException with HttpStatusCode and cause.
     * 
     * @param message human-readable error message
     * @param statusCode Spring HttpStatusCode from external API
     * @param serviceName name of the external service
     * @param cause the underlying exception
     */
    public ExternalApiException(String message, HttpStatusCode statusCode, String serviceName, Throwable cause) {
        this(message, statusCode.value(), serviceName, cause);
    }
    
    /**
     * Checks if this exception represents a rate limit error (HTTP 429).
     * 
     * @return true if status code is 429
     */
    public boolean isRateLimitError() {
        return statusCode == 429;
    }
    
    /**
     * Checks if this exception represents a network/timeout error.
     * 
     * @return true if status code is 0 (network error)
     */
    public boolean isNetworkError() {
        return statusCode == 0;
    }
    
    /**
     * Checks if this exception represents a server error (5xx).
     * 
     * @return true if status code is 500 or greater
     */
    public boolean isServerError() {
        return statusCode >= 500;
    }
}

