package app.luqma.backend.service;

import app.luqma.backend.exception.ResourceNotFoundException;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.model.dto.RecipeDetailResponse;
import app.luqma.backend.repository.RecipeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * Unit tests for RecipeDetailService.
 * Tests recipe retrieval and ingredient exclusion functionality.
 */
@ExtendWith(MockitoExtension.class)
class RecipeDetailServiceTest {
    
    @Mock
    private RecipeRepository recipeRepository;
    
    @Mock
    private NutritionCalculationService nutritionCalculationService;
    
    @Mock
    private IngredientValidationService validationService;
    
    private RecipeDetailService recipeDetailService;
    
    @BeforeEach
    void setUp() {
        recipeDetailService = new RecipeDetailService(
                recipeRepository,
                nutritionCalculationService,
                validationService
        );
    }
    
    /**
     * Test that service successfully retrieves a recipe by valid ID.
     */
    @Test
    void getRecipeById_WithValidId_ReturnsRecipe() {
        Long recipeId = 715497L;
        var mockRecipe = RecipeDetail.builder()
                .id(recipeId)
                .title("Test Recipe")
                .image("image.jpg")
                .servings(4)
                .build();
        
        when(recipeRepository.getById(recipeId)).thenReturn(mockRecipe);
        
        RecipeDetailResponse recipe = recipeDetailService.getRecipeById(recipeId);
        
        assertThat(recipe).isNotNull();
        assertThat(recipe.id()).isEqualTo(recipeId);
        assertThat(recipe.title()).isEqualTo("Test Recipe");
    }
    
    /**
     * Test that service throws ResourceNotFoundException for invalid ID.
     */
    @Test
    void getRecipeById_WithInvalidId_ThrowsResourceNotFoundException() {
        Long invalidId = 999999L;
        when(recipeRepository.getById(invalidId))
                .thenThrow(ResourceNotFoundException.forRecipe(invalidId));
        
        assertThatThrownBy(() -> recipeDetailService.getRecipeById(invalidId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found");
    }
    
    /**
     * Test that service throws exception for null ID.
     */
    @Test
    void getRecipeById_WithNullId_ThrowsException() {
        when(recipeRepository.getById(null))
                .thenThrow(new NullPointerException("Recipe ID must not be null"));
        
        assertThatThrownBy(() -> recipeDetailService.getRecipeById(null))
                .isInstanceOf(NullPointerException.class);
    }
    
    /**
     * Test that service throws IllegalArgumentException for negative ID.
     */
    @Test
    void getRecipeById_WithNegativeId_ThrowsIllegalArgumentException() {
        Long negativeId = -1L;
        when(recipeRepository.getById(negativeId))
                .thenThrow(new IllegalArgumentException("Recipe ID must be positive"));
        
        assertThatThrownBy(() -> recipeDetailService.getRecipeById(negativeId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("positive");
    }
    
    /**
     * Test that excludeIngredients returns original recipe when no ingredients to exclude.
     */
    @Test
    void excludeIngredients_WithEmptySet_ReturnsOriginalRecipe() {
        Long recipeId = 123L;
        var mockRecipe = RecipeDetail.builder()
                .id(recipeId)
                .title("Test Recipe")
                .build();
        
        when(recipeRepository.getById(recipeId)).thenReturn(mockRecipe);
        
        RecipeDetailResponse result = recipeDetailService.excludeIngredients(
                recipeId, java.util.Set.of());
        
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(recipeId);
    }
}
