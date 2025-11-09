package app.luqma.backend.exception;

import java.time.LocalDateTime;

/**
 * Standardized error response for API error responses.
 * Provides consistent error information to clients without exposing internal details.
 *
 * @param timestamp Timestamp when the error occurred
 * @param status HTTP status code
 * @param error Brief error type description
 * @param message User-friendly error message
 * @param path The request path that caused the error
 */
public record ErrorResponse(
    LocalDateTime timestamp,
    int status,
    String error,
    String message,
    String path
) {}

