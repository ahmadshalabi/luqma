package app.luqma.backend.service;

import app.luqma.backend.model.domain.ExtendedIngredient;
import app.luqma.backend.model.domain.Nutrient;
import app.luqma.backend.model.domain.NutritionInfo;
import app.luqma.backend.model.domain.RecipeDetail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for calculating nutrition information with ingredient exclusions.
 * Handles recalculation of recipe nutrition when ingredients are excluded.
 */
@Slf4j
@Service
public class NutritionCalculationService {
    
    /**
     * Recalculates recipe nutrition by excluding specified ingredients.
     * 
     * @param recipe the original recipe with full ingredient list
     * @param excludedIngredientIds set of ingredient IDs to exclude
     * @return new RecipeDetail with filtered ingredients and recalculated nutrition
     * @throws IllegalArgumentException if recipe or excludedIngredientIds is null
     */
    public RecipeDetail recalculateNutrition(RecipeDetail recipe, Set<Long> excludedIngredientIds) {
        Objects.requireNonNull(recipe, "Recipe cannot be null");
        Objects.requireNonNull(excludedIngredientIds, "Excluded ingredient IDs cannot be null");
        
        if (excludedIngredientIds.isEmpty()) {
            log.debug("No ingredients to exclude, returning original recipe");
            return recipe;
        }
        
        log.debug("Recalculating nutrition for recipe {} with {} excluded ingredients", 
                recipe.getId(), excludedIngredientIds.size());
        
        List<ExtendedIngredient> remainingIngredients = recipe.getExtendedIngredients().stream()
                .filter(ingredient -> !excludedIngredientIds.contains(ingredient.getId()))
                .collect(Collectors.toList());
        
        Map<String, Double> nutrientsToSubtract = calculateExcludedNutrients(
                recipe.getExtendedIngredients(), excludedIngredientIds);
        
        NutritionInfo updatedNutrition = recalculateNutritionInfo(
                recipe.getNutrition(), nutrientsToSubtract);
        return RecipeDetail.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .image(recipe.getImage())
                .servings(recipe.getServings())
                .readyInMinutes(recipe.getReadyInMinutes())
                .instructions(recipe.getInstructions())
                .extendedIngredients(remainingIngredients)
                .nutrition(updatedNutrition)
                .analyzedInstructions(recipe.getAnalyzedInstructions())
                .build();
    }
    
    /**
     * Calculates total nutrients from excluded ingredients.
     */
    private Map<String, Double> calculateExcludedNutrients(
            List<ExtendedIngredient> allIngredients, Set<Long> excludedIds) {
        
        Map<String, Double> excludedNutrients = new HashMap<>();
        
        allIngredients.stream()
                .filter(ingredient -> excludedIds.contains(ingredient.getId()))
                .forEach(ingredient -> {
                    if (ingredient.getNutrition() != null && 
                            ingredient.getNutrition().getNutrients() != null) {
                        
                        for (Nutrient nutrient : ingredient.getNutrition().getNutrients()) {
                            String nutrientName = nutrient.name();
                            Double currentAmount = excludedNutrients.getOrDefault(nutrientName, 0.0);
                            excludedNutrients.put(nutrientName, currentAmount + nutrient.amount());
                        }
                    }
                });
        
        log.debug("Calculated nutrients to subtract: {}", excludedNutrients);
        return excludedNutrients;
    }
    
    /**
     * Recalculates nutrition info by subtracting excluded nutrients.
     */
    private NutritionInfo recalculateNutritionInfo(
            NutritionInfo originalNutrition, Map<String, Double> nutrientsToSubtract) {
        
        if (originalNutrition == null || originalNutrition.getNutrients() == null) {
            log.warn("Original nutrition info is null or has no nutrients");
            return originalNutrition;
        }
        
        List<Nutrient> updatedNutrients = originalNutrition.getNutrients().stream()
                .map(nutrient -> {
                    String name = nutrient.name();
                    Double originalAmount = nutrient.amount();
                    Double amountToSubtract = nutrientsToSubtract.getOrDefault(name, 0.0);
                    Double newAmount = Math.max(0.0, originalAmount - amountToSubtract);
                    
                    return new Nutrient(name, newAmount, nutrient.unit());
                })
                .collect(Collectors.toList());
        
        NutritionInfo.CaloricBreakdown updatedBreakdown = 
                recalculateCaloricBreakdown(updatedNutrients);
        
        return NutritionInfo.builder()
                .nutrients(updatedNutrients)
                .caloricBreakdown(updatedBreakdown)
                .build();
    }
    
    /**
     * Recalculates caloric breakdown percentages based on updated nutrients.
     * Uses the 4-4-9 rule: protein and carbs = 4 cal/g, fat = 9 cal/g.
     */
    private NutritionInfo.CaloricBreakdown recalculateCaloricBreakdown(List<Nutrient> nutrients) {
        Double protein = findNutrientAmount(nutrients, "Protein");
        Double fat = findNutrientAmount(nutrients, "Fat");
        Double carbs = findNutrientAmount(nutrients, "Carbohydrates");
        
        double proteinCalories = protein * 4;
        double fatCalories = fat * 9;
        double carbCalories = carbs * 4;
        double totalCalories = proteinCalories + fatCalories + carbCalories;
        
        double percentProtein = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0.0;
        double percentFat = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0.0;
        double percentCarbs = totalCalories > 0 ? (carbCalories / totalCalories) * 100 : 0.0;
        
        log.debug("Recalculated breakdown - Protein: {:.2f}%, Fat: {:.2f}%, Carbs: {:.2f}%",
                percentProtein, percentFat, percentCarbs);
        
        return new NutritionInfo.CaloricBreakdown(percentProtein, percentFat, percentCarbs);
    }
    
    /**
     * Finds nutrient amount by name from the nutrients list.
     */
    private Double findNutrientAmount(List<Nutrient> nutrients, String name) {
        return nutrients.stream()
                .filter(n -> name.equalsIgnoreCase(n.name()))
                .findFirst()
                .map(Nutrient::amount)
                .orElse(0.0);
    }
}

