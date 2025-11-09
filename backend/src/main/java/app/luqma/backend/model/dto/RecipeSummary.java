package app.luqma.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Represents a single recipe in search results.
 * Contains basic recipe information for display in search listings.
 *
 * @param id Unique identifier for the recipe from Spoonacular API
 * @param title The title/name of the recipe
 * @param image URL to the recipe's image
 */
@Schema(description = "Recipe summary information")
public record RecipeSummary(
    @Schema(description = "Unique identifier for the recipe from Spoonacular API", example = "716429")
    Long id,
    
    @Schema(description = "The title/name of the recipe", example = "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs")
    String title,
    
    @Schema(description = "URL to the recipe's image", example = "https://img.spoonacular.com/recipes/716429-312x231.jpg")
    String image
) {}

