package app.luqma.backend.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Internal domain model for ingredient data from Spoonacular API.
 * Excluded from API documentation via package-level configuration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExtendedIngredient {
    
    private Long id;
    private String name;
    private Double amount;
    private String unit;
    private IngredientNutrition nutrition;
    
    /**
     * Nutrition information for an ingredient.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IngredientNutrition {
        private java.util.List<Nutrient> nutrients;
    }
}
