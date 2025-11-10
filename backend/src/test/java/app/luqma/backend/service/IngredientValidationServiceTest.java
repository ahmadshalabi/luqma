package app.luqma.backend.service;

import app.luqma.backend.constants.ErrorMessages;
import app.luqma.backend.model.domain.ExtendedIngredient;
import app.luqma.backend.model.domain.RecipeDetail;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatCode;

/**
 * Unit tests for IngredientValidationService.
 * Tests ingredient validation logic with various edge cases.
 */
class IngredientValidationServiceTest {
    
    private IngredientValidationService validationService;
    
    @BeforeEach
    void setUp() {
        validationService = new IngredientValidationService();
    }
    
    @Test
    void validateIngredientsExistInRecipe_withValidIds_doesNotThrow() {
        RecipeDetail recipe = createTestRecipe();
        Set<Long> validIds = Set.of(1L, 2L);
        
        assertThatCode(() -> validationService.validateIngredientsExistInRecipe(recipe, validIds))
                .doesNotThrowAnyException();
    }
    
    @Test
    void validateIngredientsExistInRecipe_withInvalidId_throwsException() {
        RecipeDetail recipe = createTestRecipe();
        Set<Long> invalidIds = Set.of(1L, 999L);
        
        assertThatThrownBy(() -> validationService.validateIngredientsExistInRecipe(recipe, invalidIds))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("999");
    }
    
    @Test
    void validateIngredientsExistInRecipe_withEmptySet_doesNotThrow() {
        RecipeDetail recipe = createTestRecipe();
        Set<Long> emptySet = Set.of();
        
        assertThatCode(() -> validationService.validateIngredientsExistInRecipe(recipe, emptySet))
                .doesNotThrowAnyException();
    }
    
    @Test
    void validateIngredientsExistInRecipe_withNullRecipe_throwsException() {
        assertThatThrownBy(() -> validationService.validateIngredientsExistInRecipe(null, Set.of(1L)))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("Recipe cannot be null");
    }
    
    @Test
    void validateIngredientsExistInRecipe_withNullIngredientIds_throwsException() {
        RecipeDetail recipe = createTestRecipe();
        
        assertThatThrownBy(() -> validationService.validateIngredientsExistInRecipe(recipe, null))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining(ErrorMessages.INGREDIENT_IDS_NULL);
    }
    
    @Test
    void validateIngredientIdsNotEmpty_withValidSet_doesNotThrow() {
        Set<Long> validSet = Set.of(1L, 2L);
        
        assertThatCode(() -> validationService.validateIngredientIdsNotEmpty(validSet))
                .doesNotThrowAnyException();
    }
    
    @Test
    void validateIngredientIdsNotEmpty_withEmptySet_throwsException() {
        Set<Long> emptySet = Set.of();
        
        assertThatThrownBy(() -> validationService.validateIngredientIdsNotEmpty(emptySet))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining(ErrorMessages.INGREDIENT_IDS_EMPTY);
    }
    
    @Test
    void validateIngredientIdsNotEmpty_withNull_throwsException() {
        assertThatThrownBy(() -> validationService.validateIngredientIdsNotEmpty(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining(ErrorMessages.INGREDIENT_IDS_NULL);
    }
    
    @Test
    void validateIngredientsExistInRecipe_withAllInvalidIds_throwsException() {
        RecipeDetail recipe = createTestRecipe();
        Set<Long> allInvalidIds = Set.of(999L, 888L);
        
        assertThatThrownBy(() -> validationService.validateIngredientsExistInRecipe(recipe, allInvalidIds))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("999")
                .hasMessageContaining("888");
    }
    
    // Helper method
    
    private RecipeDetail createTestRecipe() {
        List<ExtendedIngredient> ingredients = List.of(
                ExtendedIngredient.builder()
                        .id(1L)
                        .name("Ingredient 1")
                        .amount(1.0)
                        .unit("cup")
                        .build(),
                ExtendedIngredient.builder()
                        .id(2L)
                        .name("Ingredient 2")
                        .amount(2.0)
                        .unit("tbsp")
                        .build()
        );
        
        return RecipeDetail.builder()
                .id(1L)
                .title("Test Recipe")
                .image("test.jpg")
                .servings(4)
                .readyInMinutes(30)
                .extendedIngredients(ingredients)
                .build();
    }
}

