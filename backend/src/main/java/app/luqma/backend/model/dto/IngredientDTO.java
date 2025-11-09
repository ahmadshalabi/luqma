package app.luqma.backend.model.dto;

import app.luqma.backend.util.DefaultValue;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Ingredient", description = "Simplified ingredient information for API response")
public record IngredientDTO(
        @Schema(description = "Ingredient ID", example = "20409")
        Long id,
        
        @Schema(description = "Ingredient name", example = "fettuccine pasta")
        String name,
        
        @Schema(description = "Amount of ingredient", example = "16.0")
        Double amount,
        
        @Schema(description = "Unit of measurement", example = "oz")
        String unit
) {
    public IngredientDTO {
        id = DefaultValue.orZeroLong(id);
        name = DefaultValue.orElseIfBlank(name, "Unknown ingredient");
        amount = DefaultValue.orZeroDouble(amount);
        unit = DefaultValue.orElse(unit, "");
    }
}

