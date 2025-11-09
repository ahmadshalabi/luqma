package app.luqma.backend.model.domain;

import app.luqma.backend.util.DefaultValue;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Internal domain model for nutrient data from Spoonacular API.
 * Excluded from API documentation via package-level configuration.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record Nutrient(
        String name,
        Double amount,
        String unit
) {
    public Nutrient {
        name = DefaultValue.orElseIfBlank(name, "Unknown");
        amount = DefaultValue.orZeroDouble(amount);
        unit = DefaultValue.orElse(unit, "");
    }
}

