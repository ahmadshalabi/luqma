package app.luqma.backend.exception;

/**
 * Base exception class for all Luqma application exceptions.
 */
public abstract class LuqmaException extends RuntimeException {
    
    /**
     * Constructs a new LuqmaException with the specified detail message.
     *
     * @param message the detail message
     */
    protected LuqmaException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new LuqmaException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    protected LuqmaException(String message, Throwable cause) {
        super(message, cause);
    }
}

