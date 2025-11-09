package app.luqma.backend.model.domain;

import app.luqma.backend.util.CollectionUtils;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Internal domain model for recipe data from Spoonacular API.
 * Excluded from API documentation via package-level configuration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecipeDetail {
    
    private Long id;
    private String title;
    private String image;
    private Integer servings;
    
    @JsonProperty("readyInMinutes")
    private Integer readyInMinutes;
    
    private String instructions;
    
    @JsonProperty("extendedIngredients")
    @Builder.Default
    private List<ExtendedIngredient> extendedIngredients = new ArrayList<>();
    
    private NutritionInfo nutrition;
    
    @JsonProperty("analyzedInstructions")
    @Builder.Default
    private List<AnalyzedInstruction> analyzedInstructions = new ArrayList<>();
    
    public List<ExtendedIngredient> getExtendedIngredients() {
        return CollectionUtils.defensiveCopy(extendedIngredients);
    }
    
    public List<AnalyzedInstruction> getAnalyzedInstructions() {
        return CollectionUtils.defensiveCopy(analyzedInstructions);
    }
}
