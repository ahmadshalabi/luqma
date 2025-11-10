package app.luqma.backend.model.dto;

import app.luqma.backend.util.DefaultValue;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Complete recipe details for API response")
public record RecipeDetailResponse(
        @Schema(description = "Recipe ID", example = "715497", required = true)
        Long id,
        
        @Schema(description = "Recipe title", example = "Chicken Pasta Alfredo", required = true)
        String title,
        
        @Schema(description = "Recipe image URL", example = "https://spoonacular.com/recipeImages/715497-312x231.jpg")
        String image,
        
        @Schema(description = "Ready time in minutes", example = "35")
        @JsonProperty("readyInMinutes")
        Integer readyInMinutes,
        
        @Schema(description = "Number of servings", example = "4")
        Integer servings,
        
        @Schema(description = "List of ingredients with measurements")
        List<IngredientDTO> ingredients,
        
        @Schema(description = "Key nutritional information")
        NutritionDTO nutrition,
        
        @Schema(description = "Cooking instructions as list of strings")
        List<String> instructions
) {
    public RecipeDetailResponse {
        if (id == null) {
            throw new IllegalArgumentException("Recipe ID cannot be null");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Recipe title cannot be null or empty");
        }
        
        image = DefaultValue.orElse(image, "");
        readyInMinutes = DefaultValue.orZeroInt(readyInMinutes);
        servings = DefaultValue.orZeroInt(servings);
        ingredients = DefaultValue.orEmptyList(ingredients);
        nutrition = DefaultValue.orElse(nutrition, new NutritionDTO(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0));
        instructions = DefaultValue.orEmptyList(instructions);
    }
}

