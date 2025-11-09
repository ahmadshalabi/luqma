package app.luqma.backend.exception;

/**
 * Exception thrown when pagination parameters are invalid.
 * Results in a 400 Bad Request response with a user-friendly message.
 */
public class InvalidPaginationException extends RuntimeException {
    
    /**
     * Constructs a new InvalidPaginationException with the specified detail message.
     *
     * @param message the detail message explaining what went wrong
     */
    public InvalidPaginationException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new InvalidPaginationException with the specified detail message and cause.
     *
     * @param message the detail message explaining what went wrong
     * @param cause the cause of the exception
     */
    public InvalidPaginationException(String message, Throwable cause) {
        super(message, cause);
    }
}

