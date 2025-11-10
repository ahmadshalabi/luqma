package app.luqma.backend.constants;

/**
 * Constants for user-facing error messages.
 * Centralizes error messages for consistency and potential i18n support.
 */
public final class ErrorMessages {
    
    // Prevent instantiation
    private ErrorMessages() {
        throw new UnsupportedOperationException("Utility class - do not instantiate");
    }
    
    // Recipe errors
    public static final String RECIPE_NOT_FOUND = "Recipe not found with ID: %d";
    public static final String RECIPE_ID_NULL = "Recipe ID cannot be null";
    public static final String RECIPE_ID_POSITIVE = "Recipe ID must be positive";
    
    // Ingredient errors
    public static final String INGREDIENT_IDS_NULL = "Ingredient IDs cannot be null";
    public static final String INGREDIENT_IDS_EMPTY = "At least one ingredient ID must be provided";
    public static final String INVALID_INGREDIENT_IDS = "The following ingredient IDs are not in this recipe: %s";
    
    // Validation errors
    public static final String SEARCH_QUERY_REQUIRED = "Search query is required. Please provide a search term.";
    public static final String PAGE_NUMBER_MIN = "Page number must be 1 or greater";
    public static final String PAGE_SIZE_MIN = "Page size must be at least 1";
    
    // Resource loading errors
    public static final String MOCK_DATA_LOAD_FAILED = "Failed to load mock data from: %s";
    public static final String MOCK_DATA_FORMAT_INVALID = "Invalid mock data format: %s";
    
    // Server errors
    public static final String INTERNAL_ERROR = "An error occurred while processing your request. Please try again later.";
}

