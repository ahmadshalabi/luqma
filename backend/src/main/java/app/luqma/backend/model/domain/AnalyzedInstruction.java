package app.luqma.backend.model.domain;

import app.luqma.backend.util.CollectionUtils;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Internal domain model for analyzed instructions from Spoonacular API.
 * Excluded from API documentation via package-level configuration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyzedInstruction {
    
    @Builder.Default
    private List<InstructionStep> steps = new ArrayList<>();
    
    public List<InstructionStep> getSteps() {
        return CollectionUtils.defensiveCopy(steps);
    }
}
