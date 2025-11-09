package app.luqma.backend.model.domain;

import app.luqma.backend.util.DefaultValue;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Internal domain model for instruction steps from Spoonacular API.
 * Excluded from API documentation via package-level configuration.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record InstructionStep(
        Integer number,
        String step
) {
    public InstructionStep {
        number = DefaultValue.orZeroInt(number);
        step = DefaultValue.orElseIfBlank(step, "");
    }
}
