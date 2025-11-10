package app.luqma.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

/**
 * Utility class for building consistent error responses.
 */
public final class ErrorResponseBuilder {
    
    private ErrorResponseBuilder() {
        throw new UnsupportedOperationException("Utility class");
    }
    
    /**
     * Creates a ResponseEntity with ErrorResponse for the given parameters.
     *
     * @param status HTTP status for the response
     * @param message error message to display to the user
     * @param request the HTTP request that caused the error
     * @return ResponseEntity containing the error response
     */
    public static ResponseEntity<ErrorResponse> build(
            HttpStatus status, 
            String message, 
            HttpServletRequest request) {
        
        ErrorResponse errorResponse = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI()
        );
        
        return ResponseEntity.status(status).body(errorResponse);
    }
}

