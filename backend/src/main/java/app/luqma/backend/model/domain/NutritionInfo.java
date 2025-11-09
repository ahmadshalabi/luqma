package app.luqma.backend.model.domain;

import app.luqma.backend.util.CollectionUtils;
import app.luqma.backend.util.DefaultValue;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Internal domain model for nutrition data from Spoonacular API.
 * Excluded from API documentation via package-level configuration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NutritionInfo {
    
    @Builder.Default
    private List<Nutrient> nutrients = new ArrayList<>();
    
    @JsonProperty("caloricBreakdown")
    private CaloricBreakdown caloricBreakdown;
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CaloricBreakdown(
            @JsonProperty("percentProtein")
            Double percentProtein,
            
            @JsonProperty("percentFat")
            Double percentFat,
            
            @JsonProperty("percentCarbs")
            Double percentCarbs
    ) {
        public CaloricBreakdown {
            percentProtein = DefaultValue.orZeroDouble(percentProtein);
            percentFat = DefaultValue.orZeroDouble(percentFat);
            percentCarbs = DefaultValue.orZeroDouble(percentCarbs);
        }
    }
    
    public List<Nutrient> getNutrients() {
        return CollectionUtils.defensiveCopy(nutrients);
    }
}
