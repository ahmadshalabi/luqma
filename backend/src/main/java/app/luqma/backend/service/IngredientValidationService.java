package app.luqma.backend.service;

import app.luqma.backend.constants.ErrorMessages;
import app.luqma.backend.model.domain.ExtendedIngredient;
import app.luqma.backend.model.domain.RecipeDetail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for validating ingredient operations.
 * Centralizes ingredient validation logic for reusability.
 */
@Slf4j
@Service
public class IngredientValidationService {
    
    /**
     * Validates that all provided ingredient IDs exist in the given recipe.
     * 
     * @param recipe the recipe to validate against
     * @param ingredientIds set of ingredient IDs to validate
     * @throws IllegalArgumentException if any ingredient ID is not in the recipe
     * @throws IllegalArgumentException if parameters are null
     */
    public void validateIngredientsExistInRecipe(RecipeDetail recipe, Set<Long> ingredientIds) {
        Objects.requireNonNull(recipe, "Recipe cannot be null");
        Objects.requireNonNull(ingredientIds, ErrorMessages.INGREDIENT_IDS_NULL);
        
        if (ingredientIds.isEmpty()) {
            log.debug("No ingredient IDs to validate");
            return;
        }
        
        log.debug("Validating {} ingredient IDs for recipe {}", ingredientIds.size(), recipe.getId());
        
        Set<Long> recipeIngredientIds = recipe.getExtendedIngredients().stream()
                .map(ExtendedIngredient::getId)
                .collect(Collectors.toSet());
        
        List<Long> invalidIds = ingredientIds.stream()
                .filter(id -> !recipeIngredientIds.contains(id))
                .collect(Collectors.toList());
        
        if (!invalidIds.isEmpty()) {
            log.warn("Invalid ingredient IDs for recipe {}: {}", recipe.getId(), invalidIds);
            throw new IllegalArgumentException(
                    String.format(ErrorMessages.INVALID_INGREDIENT_IDS, invalidIds));
        }
        
        log.debug("All ingredient IDs valid for recipe {}", recipe.getId());
    }
    
    /**
     * Validates that the ingredient IDs set is not null or empty.
     * 
     * @param ingredientIds set of ingredient IDs
     * @throws IllegalArgumentException if null or empty
     */
    public void validateIngredientIdsNotEmpty(Set<Long> ingredientIds) {
        if (ingredientIds == null) {
            throw new IllegalArgumentException(ErrorMessages.INGREDIENT_IDS_NULL);
        }
        
        if (ingredientIds.isEmpty()) {
            throw new IllegalArgumentException(ErrorMessages.INGREDIENT_IDS_EMPTY);
        }
    }
}

