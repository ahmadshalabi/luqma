package app.luqma.backend.exception;

/**
 * Exception thrown when a resource (such as mock data) fails to load.
 * Results in a 500 Internal Server Error response.
 */
public class ResourceLoadException extends RuntimeException {
    
    /**
     * Constructs a new ResourceLoadException with the specified detail message.
     *
     * @param message the detail message explaining what resource failed to load
     */
    public ResourceLoadException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new ResourceLoadException with the specified detail message and cause.
     *
     * @param message the detail message explaining what resource failed to load
     * @param cause the cause of the exception
     */
    public ResourceLoadException(String message, Throwable cause) {
        super(message, cause);
    }
}

