package app.luqma.backend.service;

import app.luqma.backend.mapper.RecipeMapper;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.model.dto.RecipeDetailResponse;
import app.luqma.backend.repository.RecipeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Service for managing recipe details and operations.
 * Orchestrates business logic for recipe retrieval and ingredient exclusion.
 * 
 * Responsibilities:
 * - Retrieve recipe details by ID
 * - Handle ingredient exclusion with nutrition recalculation
 * - Coordinate between repository, validation, and calculation services
 */
@Slf4j
@Service
public class RecipeDetailService {
    
    private final RecipeRepository recipeRepository;
    private final NutritionCalculationService nutritionCalculationService;
    private final IngredientValidationService validationService;
    
    public RecipeDetailService(
            RecipeRepository recipeRepository,
            NutritionCalculationService nutritionCalculationService,
            IngredientValidationService validationService) {
        this.recipeRepository = recipeRepository;
        this.nutritionCalculationService = nutritionCalculationService;
        this.validationService = validationService;
    }
    
    /**
     * Retrieves a recipe by ID.
     *
     * @param id the recipe ID
     * @return recipe detail response DTO
     * @throws app.luqma.backend.exception.ResourceNotFoundException if recipe not found
     * @throws IllegalArgumentException if ID is null or invalid
     */
    public RecipeDetailResponse getRecipeById(Long id) {
        log.debug("Fetching recipe with ID: {}", id);
        
        RecipeDetail recipe = recipeRepository.getById(id);
        return RecipeMapper.toRecipeDetailResponse(recipe);
    }
    
    /**
     * Excludes specified ingredients from a recipe and recalculates nutrition.
     * 
     * @param recipeId the recipe ID
     * @param ingredientIds set of ingredient IDs to exclude
     * @return recipe detail response with updated ingredients and nutrition
     * @throws app.luqma.backend.exception.ResourceNotFoundException if recipe not found
     * @throws IllegalArgumentException if any excluded ingredient ID is not in the recipe
     */
    public RecipeDetailResponse excludeIngredients(Long recipeId, Set<Long> ingredientIds) {
        if (ingredientIds.isEmpty()) {
            log.debug("No ingredients to exclude, returning original recipe");
            return getRecipeById(recipeId);
        }
        
        log.info("Excluding {} ingredients from recipe {}", ingredientIds.size(), recipeId);
        
        RecipeDetail originalRecipe = recipeRepository.getById(recipeId);
        
        validationService.validateIngredientsExistInRecipe(originalRecipe, ingredientIds);
        
        RecipeDetail updatedRecipe = nutritionCalculationService.recalculateNutrition(
                originalRecipe, ingredientIds);
        
        log.debug("Successfully excluded ingredients from recipe {}", recipeId);
        
        return RecipeMapper.toRecipeDetailResponse(updatedRecipe);
    }
    
}

