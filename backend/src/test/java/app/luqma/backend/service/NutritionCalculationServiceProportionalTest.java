package app.luqma.backend.service;

import app.luqma.backend.model.domain.ExtendedIngredient;
import app.luqma.backend.model.domain.Nutrient;
import app.luqma.backend.model.domain.NutritionInfo;
import app.luqma.backend.model.domain.RecipeDetail;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

/**
 * Tests for proportional estimation in nutrition recalculation.
 * Verifies that nutrition values are reduced proportionally based on
 * excluded ingredient weights when ingredient-level nutrition is unavailable.
 */
class NutritionCalculationServiceProportionalTest {
    
    private NutritionCalculationService service;
    
    @BeforeEach
    void setUp() {
        service = new NutritionCalculationService();
    }
    
    @Test
    void recalculateNutrition_WithProportionalEstimation_ReducesNutritionCorrectly() {
        // Given: A recipe with 3 ingredients totaling ~300g
        // - 240g pasta (1 cup = 240g)
        // - 30g butter (2 tbsp = 30g)  
        // - 30g cheese (2 tbsp = 30g)
        // Total: ~300g
        
        ExtendedIngredient pasta = ExtendedIngredient.builder()
                .id(1L)
                .name("pasta")
                .amount(1.0)
                .unit("cup")
                .build();
        
        ExtendedIngredient butter = ExtendedIngredient.builder()
                .id(2L)
                .name("butter")
                .amount(2.0)
                .unit("tbsp")
                .build();
        
        ExtendedIngredient cheese = ExtendedIngredient.builder()
                .id(3L)
                .name("cheese")
                .amount(2.0)
                .unit("tbsp")
                .build();
        
        List<Nutrient> originalNutrients = List.of(
                new Nutrient("Calories", 600.0, "kcal"),
                new Nutrient("Protein", 20.0, "g"),
                new Nutrient("Fat", 30.0, "g"),
                new Nutrient("Carbohydrates", 80.0, "g")
        );
        
        NutritionInfo nutrition = NutritionInfo.builder()
                .nutrients(originalNutrients)
                .build();
        
        RecipeDetail recipe = RecipeDetail.builder()
                .id(123L)
                .title("Test Pasta")
                .extendedIngredients(List.of(pasta, butter, cheese))
                .nutrition(nutrition)
                .build();
        
        // When: Excluding pasta (240g out of 300g = 80%)
        RecipeDetail result = service.recalculateNutrition(recipe, Set.of(1L));
        
        // Then: Nutrition should be reduced by approximately 80%
        // Remaining: 20% of original nutrition (60g out of 300g)
        assertThat(result.getNutrition()).isNotNull();
        assertThat(result.getNutrition().getNutrients()).hasSize(4);
        
        // Check calories: 600 * 0.20 = 120 kcal
        Nutrient calories = findNutrient(result.getNutrition().getNutrients(), "Calories");
        assertThat(calories.amount()).isCloseTo(120.0, within(5.0));
        
        // Check protein: 20 * 0.20 = 4g
        Nutrient protein = findNutrient(result.getNutrition().getNutrients(), "Protein");
        assertThat(protein.amount()).isCloseTo(4.0, within(0.5));
        
        // Check fat: 30 * 0.20 = 6g
        Nutrient fat = findNutrient(result.getNutrition().getNutrients(), "Fat");
        assertThat(fat.amount()).isCloseTo(6.0, within(0.5));
        
        // Check carbs: 80 * 0.20 = 16g
        Nutrient carbs = findNutrient(result.getNutrition().getNutrients(), "Carbohydrates");
        assertThat(carbs.amount()).isCloseTo(16.0, within(1.0));
        
        // Ingredients list should be filtered
        assertThat(result.getExtendedIngredients()).hasSize(2);
        assertThat(result.getExtendedIngredients())
                .extracting(ExtendedIngredient::getName)
                .containsExactly("butter", "cheese");
    }
    
    @Test
    void recalculateNutrition_WithMultipleExcludedIngredients_CalculatesCorrectProportion() {
        // Given: Recipe with ingredients in grams
        ExtendedIngredient flour = ExtendedIngredient.builder()
                .id(1L)
                .name("flour")
                .amount(200.0)
                .unit("g")
                .build();
        
        ExtendedIngredient sugar = ExtendedIngredient.builder()
                .id(2L)
                .name("sugar")
                .amount(100.0)
                .unit("g")
                .build();
        
        ExtendedIngredient eggs = ExtendedIngredient.builder()
                .id(3L)
                .name("eggs")
                .amount(100.0)
                .unit("g")
                .build();
        
        // Total: 400g
        
        List<Nutrient> nutrients = List.of(
                new Nutrient("Calories", 1000.0, "kcal"),
                new Nutrient("Protein", 30.0, "g")
        );
        
        RecipeDetail recipe = RecipeDetail.builder()
                .id(456L)
                .title("Test Cake")
                .extendedIngredients(List.of(flour, sugar, eggs))
                .nutrition(NutritionInfo.builder().nutrients(nutrients).build())
                .build();
        
        // When: Excluding flour (200g) and sugar (100g) = 300g out of 400g = 75%
        RecipeDetail result = service.recalculateNutrition(recipe, Set.of(1L, 2L));
        
        // Then: Should keep 25% of nutrition (100g eggs out of 400g)
        Nutrient calories = findNutrient(result.getNutrition().getNutrients(), "Calories");
        assertThat(calories.amount()).isCloseTo(250.0, within(10.0)); // 1000 * 0.25
        
        Nutrient protein = findNutrient(result.getNutrition().getNutrients(), "Protein");
        assertThat(protein.amount()).isCloseTo(7.5, within(1.0)); // 30 * 0.25
        
        assertThat(result.getExtendedIngredients()).hasSize(1);
        assertThat(result.getExtendedIngredients().get(0).getName()).isEqualTo("eggs");
    }
    
    @Test
    void recalculateNutrition_WithWeightUnits_ConvertsCorrectly() {
        // Given: Recipe with different weight units
        ExtendedIngredient chicken = ExtendedIngredient.builder()
                .id(1L)
                .name("chicken")
                .amount(1.0)
                .unit("lb") // 1 lb = ~454g
                .build();
        
        ExtendedIngredient rice = ExtendedIngredient.builder()
                .id(2L)
                .name("rice")
                .amount(200.0)
                .unit("g")
                .build();
        
        // Total: ~654g
        
        List<Nutrient> nutrients = List.of(
                new Nutrient("Calories", 800.0, "kcal")
        );
        
        RecipeDetail recipe = RecipeDetail.builder()
                .id(789L)
                .title("Chicken and Rice")
                .extendedIngredients(List.of(chicken, rice))
                .nutrition(NutritionInfo.builder().nutrients(nutrients).build())
                .build();
        
        // When: Excluding chicken (454g out of 654g = ~69%)
        RecipeDetail result = service.recalculateNutrition(recipe, Set.of(1L));
        
        // Then: Should keep ~31% of nutrition (200g rice)
        Nutrient calories = findNutrient(result.getNutrition().getNutrients(), "Calories");
        assertThat(calories.amount()).isCloseTo(248.0, within(30.0)); // 800 * 0.31
    }
    
    @Test
    void recalculateNutrition_WithNoExcludedIngredients_ReturnsOriginal() {
        // Given: A recipe
        RecipeDetail recipe = RecipeDetail.builder()
                .id(100L)
                .title("Test")
                .extendedIngredients(List.of())
                .nutrition(NutritionInfo.builder()
                        .nutrients(List.of(new Nutrient("Calories", 500.0, "kcal")))
                        .build())
                .build();
        
        // When: Excluding nothing
        RecipeDetail result = service.recalculateNutrition(recipe, Set.of());
        
        // Then: Should return original
        assertThat(result).isSameAs(recipe);
    }
    
    @Test
    void recalculateNutrition_WithAllIngredientsExcluded_ReturnsZeroNutrition() {
        // Given: Recipe with one ingredient
        ExtendedIngredient pasta = ExtendedIngredient.builder()
                .id(1L)
                .name("pasta")
                .amount(100.0)
                .unit("g")
                .build();
        
        RecipeDetail recipe = RecipeDetail.builder()
                .id(200L)
                .title("Pasta")
                .extendedIngredients(List.of(pasta))
                .nutrition(NutritionInfo.builder()
                        .nutrients(List.of(new Nutrient("Calories", 300.0, "kcal")))
                        .build())
                .build();
        
        // When: Excluding all ingredients
        RecipeDetail result = service.recalculateNutrition(recipe, Set.of(1L));
        
        // Then: Nutrition should be zero
        Nutrient calories = findNutrient(result.getNutrition().getNutrients(), "Calories");
        assertThat(calories.amount()).isCloseTo(0.0, within(0.1));
        
        assertThat(result.getExtendedIngredients()).isEmpty();
    }
    
    private Nutrient findNutrient(List<Nutrient> nutrients, String name) {
        return nutrients.stream()
                .filter(n -> n.name().equals(name))
                .findFirst()
                .orElseThrow(() -> new AssertionError("Nutrient not found: " + name));
    }
}

