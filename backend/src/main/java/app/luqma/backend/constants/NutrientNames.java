package app.luqma.backend.constants;

/**
 * Constants for nutrient names used throughout the application.
 * Centralizes nutrient name strings to avoid magic strings and typos.
 */
public final class NutrientNames {
    
    // Prevent instantiation
    private NutrientNames() {
        throw new UnsupportedOperationException("Utility class - do not instantiate");
    }
    
    // Primary nutrients
    public static final String CALORIES = "Calories";
    public static final String PROTEIN = "Protein";
    public static final String FAT = "Fat";
    public static final String CARBOHYDRATES = "Carbohydrates";
    public static final String FIBER = "Fiber";
    
    // Additional nutrients (for future use)
    public static final String SUGAR = "Sugar";
    public static final String SODIUM = "Sodium";
    public static final String CHOLESTEROL = "Cholesterol";
    public static final String SATURATED_FAT = "Saturated Fat";
    public static final String VITAMIN_A = "Vitamin A";
    public static final String VITAMIN_C = "Vitamin C";
    public static final String CALCIUM = "Calcium";
    public static final String IRON = "Iron";
}

