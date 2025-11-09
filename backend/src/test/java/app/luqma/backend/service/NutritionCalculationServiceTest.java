package app.luqma.backend.service;

import app.luqma.backend.model.domain.ExtendedIngredient;
import app.luqma.backend.model.domain.Nutrient;
import app.luqma.backend.model.domain.NutritionInfo;
import app.luqma.backend.model.domain.RecipeDetail;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.within;

/**
 * Unit tests for NutritionCalculationService.
 * Tests nutrition recalculation with ingredient exclusion.
 */
class NutritionCalculationServiceTest {
    
    private NutritionCalculationService nutritionCalculationService;
    
    @BeforeEach
    void setUp() {
        nutritionCalculationService = new NutritionCalculationService();
    }
    
    @Test
    void recalculateNutrition_withNoExclusions_returnsOriginalRecipe() {
        // Given
        RecipeDetail originalRecipe = createTestRecipe();
        Set<Long> emptyExclusions = Set.of();
        
        // When
        RecipeDetail result = nutritionCalculationService.recalculateNutrition(originalRecipe, emptyExclusions);
        
        // Then
        assertThat(result).isEqualTo(originalRecipe);
    }
    
    @Test
    void recalculateNutrition_withOneExclusion_updatesNutrition() {
        // Given
        RecipeDetail originalRecipe = createTestRecipe();
        Set<Long> exclusions = Set.of(1L);  // Exclude first ingredient
        
        // When
        RecipeDetail result = nutritionCalculationService.recalculateNutrition(originalRecipe, exclusions);
        
        // Then
        assertThat(result.getExtendedIngredients()).hasSize(1);
        assertThat(result.getExtendedIngredients().get(0).getId()).isEqualTo(2L);
        
        // Verify nutrition was recalculated
        Double newCalories = findNutrientAmount(result.getNutrition().getNutrients(), "Calories");
        assertThat(newCalories).isCloseTo(300.0, within(0.1));  // 500 - 200
    }
    
    @Test
    void recalculateNutrition_withMultipleExclusions_updatesNutritionCorrectly() {
        // Given
        RecipeDetail recipe = createTestRecipeWithThreeIngredients();
        Set<Long> exclusions = Set.of(1L, 2L);  // Exclude first two ingredients
        
        // When
        RecipeDetail result = nutritionCalculationService.recalculateNutrition(recipe, exclusions);
        
        // Then
        assertThat(result.getExtendedIngredients()).hasSize(1);
        assertThat(result.getExtendedIngredients().get(0).getId()).isEqualTo(3L);
        
        // Verify nutrition calculations
        List<Nutrient> nutrients = result.getNutrition().getNutrients();
        assertThat(findNutrientAmount(nutrients, "Calories")).isCloseTo(150.0, within(0.1));
        assertThat(findNutrientAmount(nutrients, "Protein")).isCloseTo(5.0, within(0.1));
    }
    
    @Test
    void recalculateNutrition_recalculatesCaloricBreakdown() {
        // Given
        RecipeDetail recipe = createTestRecipe();
        Set<Long> exclusions = Set.of(1L);
        
        // When
        RecipeDetail result = nutritionCalculationService.recalculateNutrition(recipe, exclusions);
        
        // Then
        NutritionInfo.CaloricBreakdown breakdown = result.getNutrition().getCaloricBreakdown();
        assertThat(breakdown).isNotNull();
        
        // Verify percentages add up to approximately 100%
        double total = breakdown.percentProtein() + breakdown.percentFat() + breakdown.percentCarbs();
        assertThat(total).isCloseTo(100.0, within(1.0));
    }
    
    @Test
    void recalculateNutrition_withAllIngredientsExcluded_returnsEmptyIngredients() {
        // Given
        RecipeDetail recipe = createTestRecipe();
        Set<Long> exclusions = Set.of(1L, 2L);  // Exclude all ingredients
        
        // When
        RecipeDetail result = nutritionCalculationService.recalculateNutrition(recipe, exclusions);
        
        // Then
        assertThat(result.getExtendedIngredients()).isEmpty();
        
        // Nutrition should be all zeros or very close
        List<Nutrient> nutrients = result.getNutrition().getNutrients();
        assertThat(findNutrientAmount(nutrients, "Calories")).isCloseTo(0.0, within(0.1));
    }
    
    @Test
    void recalculateNutrition_withNullRecipe_throwsException() {
        // When/Then
        assertThatThrownBy(() -> nutritionCalculationService.recalculateNutrition(null, Set.of(1L)))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("Recipe cannot be null");
    }
    
    @Test
    void recalculateNutrition_withNullExclusions_throwsException() {
        // Given
        RecipeDetail recipe = createTestRecipe();
        
        // When/Then
        assertThatThrownBy(() -> nutritionCalculationService.recalculateNutrition(recipe, null))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("Excluded ingredient IDs cannot be null");
    }
    
    @Test
    void recalculateNutrition_withNonExistentIngredientId_doesNotAffectResult() {
        // Given
        RecipeDetail recipe = createTestRecipe();
        Set<Long> exclusions = Set.of(999L);  // Non-existent ID
        
        // When
        RecipeDetail result = nutritionCalculationService.recalculateNutrition(recipe, exclusions);
        
        // Then - should return recipe with all ingredients unchanged
        assertThat(result.getExtendedIngredients()).hasSize(2);
        Double calories = findNutrientAmount(result.getNutrition().getNutrients(), "Calories");
        assertThat(calories).isCloseTo(500.0, within(0.1));
    }
    
    @Test
    void recalculateNutrition_preservesNonNutritionFields() {
        // Given
        RecipeDetail recipe = createTestRecipe();
        Set<Long> exclusions = Set.of(1L);
        
        // When
        RecipeDetail result = nutritionCalculationService.recalculateNutrition(recipe, exclusions);
        
        // Then
        assertThat(result.getId()).isEqualTo(recipe.getId());
        assertThat(result.getTitle()).isEqualTo(recipe.getTitle());
        assertThat(result.getImage()).isEqualTo(recipe.getImage());
        assertThat(result.getServings()).isEqualTo(recipe.getServings());
        assertThat(result.getReadyInMinutes()).isEqualTo(recipe.getReadyInMinutes());
        assertThat(result.getInstructions()).isEqualTo(recipe.getInstructions());
    }
    
    // Helper methods
    
    private RecipeDetail createTestRecipe() {
        List<ExtendedIngredient> ingredients = new ArrayList<>();
        
        // Ingredient 1: 200 calories, 10g protein, 5g fat, 20g carbs
        ingredients.add(createIngredient(1L, "Ingredient 1", 
                200.0, 10.0, 5.0, 20.0));
        
        // Ingredient 2: 300 calories, 15g protein, 10g fat, 30g carbs
        ingredients.add(createIngredient(2L, "Ingredient 2", 
                300.0, 15.0, 10.0, 30.0));
        
        List<Nutrient> totalNutrients = List.of(
                new Nutrient("Calories", 500.0, "kcal"),
                new Nutrient("Protein", 25.0, "g"),
                new Nutrient("Fat", 15.0, "g"),
                new Nutrient("Carbohydrates", 50.0, "g")
        );
        
        NutritionInfo.CaloricBreakdown breakdown = new NutritionInfo.CaloricBreakdown(
                20.0, 27.0, 40.0
        );
        
        NutritionInfo nutrition = NutritionInfo.builder()
                .nutrients(totalNutrients)
                .caloricBreakdown(breakdown)
                .build();
        
        return RecipeDetail.builder()
                .id(1L)
                .title("Test Recipe")
                .image("test.jpg")
                .servings(4)
                .readyInMinutes(30)
                .instructions("Test instructions")
                .extendedIngredients(ingredients)
                .nutrition(nutrition)
                .build();
    }
    
    private RecipeDetail createTestRecipeWithThreeIngredients() {
        List<ExtendedIngredient> ingredients = new ArrayList<>();
        
        ingredients.add(createIngredient(1L, "Ingredient 1", 200.0, 10.0, 5.0, 20.0));
        ingredients.add(createIngredient(2L, "Ingredient 2", 300.0, 15.0, 10.0, 30.0));
        ingredients.add(createIngredient(3L, "Ingredient 3", 150.0, 5.0, 3.0, 15.0));
        
        List<Nutrient> totalNutrients = List.of(
                new Nutrient("Calories", 650.0, "kcal"),
                new Nutrient("Protein", 30.0, "g"),
                new Nutrient("Fat", 18.0, "g"),
                new Nutrient("Carbohydrates", 65.0, "g")
        );
        
        NutritionInfo.CaloricBreakdown breakdown = new NutritionInfo.CaloricBreakdown(
                18.46, 24.92, 40.0
        );
        
        NutritionInfo nutrition = NutritionInfo.builder()
                .nutrients(totalNutrients)
                .caloricBreakdown(breakdown)
                .build();
        
        return RecipeDetail.builder()
                .id(2L)
                .title("Test Recipe with Three Ingredients")
                .image("test2.jpg")
                .servings(6)
                .readyInMinutes(45)
                .extendedIngredients(ingredients)
                .nutrition(nutrition)
                .build();
    }
    
    private ExtendedIngredient createIngredient(Long id, String name, 
            Double calories, Double protein, Double fat, Double carbs) {
        
        List<Nutrient> nutrients = List.of(
                new Nutrient("Calories", calories, "kcal"),
                new Nutrient("Protein", protein, "g"),
                new Nutrient("Fat", fat, "g"),
                new Nutrient("Carbohydrates", carbs, "g")
        );
        
        ExtendedIngredient.IngredientNutrition nutrition = 
                ExtendedIngredient.IngredientNutrition.builder()
                        .nutrients(nutrients)
                        .build();
        
        return ExtendedIngredient.builder()
                .id(id)
                .name(name)
                .amount(1.0)
                .unit("cup")
                .nutrition(nutrition)
                .build();
    }
    
    private Double findNutrientAmount(List<Nutrient> nutrients, String name) {
        return nutrients.stream()
                .filter(n -> name.equalsIgnoreCase(n.name()))
                .findFirst()
                .map(Nutrient::amount)
                .orElse(0.0);
    }
}

