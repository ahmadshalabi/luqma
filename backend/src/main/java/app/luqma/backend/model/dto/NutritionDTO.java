package app.luqma.backend.model.dto;

import app.luqma.backend.util.DefaultValue;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Nutrition", description = "Key nutritional information for API response")
public record NutritionDTO(
        @Schema(description = "Total calories", example = "594.0")
        Double calories,
        
        @Schema(description = "Protein in grams", example = "35.33")
        Double protein,
        
        @Schema(description = "Fat in grams", example = "36.45")
        Double fat,
        
        @Schema(description = "Carbohydrates in grams", example = "29.7")
        Double carbohydrates,
        
        @Schema(description = "Fiber in grams", example = "1.2")
        Double fiber,
        
        @Schema(description = "Percentage of calories from protein", example = "23.79")
        @JsonProperty("percentProtein")
        Double percentProtein,
        
        @Schema(description = "Percentage of calories from fat", example = "55.29")
        @JsonProperty("percentFat")
        Double percentFat,
        
        @Schema(description = "Percentage of calories from carbs", example = "20.92")
        @JsonProperty("percentCarbs")
        Double percentCarbs
) {
    public NutritionDTO {
        calories = DefaultValue.orZeroDouble(calories);
        protein = DefaultValue.orZeroDouble(protein);
        fat = DefaultValue.orZeroDouble(fat);
        carbohydrates = DefaultValue.orZeroDouble(carbohydrates);
        fiber = DefaultValue.orZeroDouble(fiber);
        percentProtein = DefaultValue.orZeroDouble(percentProtein);
        percentFat = DefaultValue.orZeroDouble(percentFat);
        percentCarbs = DefaultValue.orZeroDouble(percentCarbs);
    }
}

