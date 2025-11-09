package app.luqma.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Request DTO for excluding ingredients from a recipe.
 */
@Schema(description = "Request to exclude ingredients from a recipe")
public record ExcludeIngredientsRequest(
        @Schema(
                description = "List of ingredient IDs to exclude from the recipe",
                example = "[20409, 5006]",
                required = true
        )
        @NotNull(message = "Ingredient IDs list cannot be null")
        @Size(min = 1, message = "At least one ingredient ID must be provided")
        List<Long> ingredientIds
) {
}

