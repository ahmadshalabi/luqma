package app.luqma.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested resource is not found.
 * Returns HTTP 404 status code.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends LuqmaException {
    
    /**
     * Constructs a new ResourceNotFoundException with the specified detail message.
     *
     * @param message the detail message
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new ResourceNotFoundException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Creates a ResourceNotFoundException for a recipe not found scenario.
     *
     * @param recipeId the ID of the recipe that was not found
     * @return a new ResourceNotFoundException with appropriate message
     */
    public static ResourceNotFoundException forRecipe(Long recipeId) {
        return new ResourceNotFoundException(
                "Recipe with ID " + recipeId + " not found. Please try another recipe.");
    }
}

