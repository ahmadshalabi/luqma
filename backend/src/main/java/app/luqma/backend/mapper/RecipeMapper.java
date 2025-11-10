package app.luqma.backend.mapper;

import app.luqma.backend.model.domain.ExtendedIngredient;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.model.dto.IngredientDTO;
import app.luqma.backend.model.dto.NutritionDTO;
import app.luqma.backend.model.dto.RecipeDetailResponse;
import app.luqma.backend.mapper.NutrientExtractor;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Mapper class for converting between domain models and DTOs.
 * Centralizes all DTO mapping logic to reduce code duplication.
 */
@Slf4j
public final class RecipeMapper {
    
    private RecipeMapper() {
        throw new UnsupportedOperationException("Utility class - do not instantiate");
    }
    
    /**
     * Maps a RecipeDetail domain model to RecipeDetailResponse DTO.
     * 
     * @param recipe the recipe domain model
     * @return RecipeDetailResponse DTO
     */
    public static RecipeDetailResponse toRecipeDetailResponse(RecipeDetail recipe) {
        log.debug("Mapping recipe to response DTO: {}", recipe.getId());
        
        var ingredients = Optional.ofNullable(recipe.getExtendedIngredients())
                .orElse(List.of())
                .stream()
                .map(RecipeMapper::toIngredientDTO)
                .collect(Collectors.toList());
        
        var nutritionDTO = NutrientExtractor.extractNutritionDTO(recipe.getNutrition());
        var instructions = extractInstructions(recipe);
        
        return new RecipeDetailResponse(
                recipe.getId(),
                recipe.getTitle(),
                recipe.getImage(),
                recipe.getReadyInMinutes(),
                recipe.getServings(),
                ingredients,
                nutritionDTO,
                instructions
        );
    }
    
    /**
     * Maps an ExtendedIngredient domain model to IngredientDTO.
     * 
     * @param ingredient the ingredient domain model
     * @return IngredientDTO
     */
    public static IngredientDTO toIngredientDTO(ExtendedIngredient ingredient) {
        return new IngredientDTO(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getAmount(),
                ingredient.getUnit()
        );
    }
    
    /**
     * Extracts cooking instructions from recipe in a standardized format.
     * Attempts to extract from analyzedInstructions first, falls back to simple instructions string.
     * Returns instruction text only, without step numbers (frontend handles numbering).
     * 
     * @param recipe the recipe domain model
     * @return list of instruction strings
     */
    private static List<String> extractInstructions(RecipeDetail recipe) {
        var analyzedInstructions = recipe.getAnalyzedInstructions();
        if (analyzedInstructions != null && !analyzedInstructions.isEmpty()) {
            return analyzedInstructions.stream()
                    .flatMap(ai -> ai.getSteps().stream())
                    .map(step -> step.step())
                    .collect(Collectors.toList());
        }
        
        var simpleInstructions = recipe.getInstructions();
        if (simpleInstructions != null && !simpleInstructions.isBlank()) {
            return Arrays.stream(simpleInstructions.split("\\. "))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(s -> s.endsWith(".") ? s : s + ".")
                    .collect(Collectors.toList());
        }
        
        log.debug("No instructions available for recipe: {}", recipe.getId());
        return List.of();
    }
}

