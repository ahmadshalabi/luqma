package app.luqma.backend.service;

import app.luqma.backend.model.domain.ExtendedIngredient;
import app.luqma.backend.model.domain.Nutrient;
import app.luqma.backend.model.domain.NutritionInfo;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.mapper.NutrientExtractor;
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
 * 
 * <p>Uses proportional estimation based on ingredient weights/volumes when
 * ingredient-level nutrition data is not available from the API.
 * 
 * <p><strong>Estimation Method:</strong>
 * Calculates the proportion of excluded ingredients relative to total recipe
 * weight and applies that proportion to each nutrient. For example, if excluded
 * ingredients represent 25% of the recipe's total weight, approximately 25% of
 * each nutrient is subtracted.
 */
@Slf4j
@Service
public class NutritionCalculationService {
    
    // Common volume to weight conversions (approximate, in grams)
    private static final Map<String, Double> VOLUME_TO_GRAMS = Map.ofEntries(
            Map.entry("cup", 240.0),
            Map.entry("tablespoon", 15.0),
            Map.entry("tbsp", 15.0),
            Map.entry("teaspoon", 5.0),
            Map.entry("tsp", 5.0),
            Map.entry("fluid ounce", 30.0),
            Map.entry("fl oz", 30.0),
            Map.entry("pint", 473.0),
            Map.entry("quart", 946.0),
            Map.entry("liter", 1000.0),
            Map.entry("l", 1000.0),
            Map.entry("milliliter", 1.0),
            Map.entry("ml", 1.0)
    );
    
    /**
     * Recalculates recipe nutrition by excluding specified ingredients.
     * 
     * <p>Uses proportional estimation when ingredient-level nutrition is unavailable.
     * The proportion is based on ingredient weight/volume relative to the total recipe.
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
        
        List<ExtendedIngredient> allIngredients = recipe.getExtendedIngredients();
        List<ExtendedIngredient> remainingIngredients = allIngredients.stream()
                .filter(ingredient -> !excludedIngredientIds.contains(ingredient.getId()))
                .collect(Collectors.toList());
        
        // Try ingredient-level nutrition first (if available)
        Map<String, Double> nutrientsToSubtract = calculateExcludedNutrients(
                allIngredients, excludedIngredientIds);
        
        NutritionInfo updatedNutrition;
        
        if (nutrientsToSubtract.isEmpty()) {
            // Fallback to proportional estimation
            log.debug("No ingredient-level nutrition available, using proportional estimation");
            double excludedProportion = calculateExcludedProportion(allIngredients, excludedIngredientIds);
            updatedNutrition = applyProportionalReduction(recipe.getNutrition(), excludedProportion);
        } else {
            // Use actual nutrient data
            updatedNutrition = recalculateNutritionInfo(recipe.getNutrition(), nutrientsToSubtract);
        }
        
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
     * Calculates the proportion of excluded ingredients relative to total recipe weight.
     * 
     * <p>Converts all ingredients to grams (approximate) and calculates what percentage
     * of the total recipe is being excluded.
     * 
     * @param allIngredients all ingredients in the recipe
     * @param excludedIds IDs of ingredients to exclude
     * @return proportion of excluded ingredients (0.0 to 1.0)
     */
    private double calculateExcludedProportion(List<ExtendedIngredient> allIngredients, Set<Long> excludedIds) {
        double totalWeight = 0.0;
        double excludedWeight = 0.0;
        
        for (ExtendedIngredient ingredient : allIngredients) {
            double weight = convertToGrams(ingredient.getAmount(), ingredient.getUnit());
            totalWeight += weight;
            
            if (excludedIds.contains(ingredient.getId())) {
                excludedWeight += weight;
            }
        }
        
        if (totalWeight == 0.0) {
            log.warn("Total recipe weight is 0, cannot calculate proportion");
            return 0.0;
        }
        
        double proportion = excludedWeight / totalWeight;
        log.debug("Excluded proportion: {:.2%} (excluded: {}g, total: {}g)", 
                proportion * 100, excludedWeight, totalWeight);
        
        return proportion;
    }
    
    /**
     * Converts ingredient amount to grams for weight comparison.
     * 
     * <p>Uses standard conversions for common units. Weight units (g, oz, lb) are
     * converted directly. Volume units (cup, tbsp, etc.) use approximate conversions.
     * 
     * @param amount ingredient amount
     * @param unit ingredient unit (can be null)
     * @return approximate weight in grams
     */
    private double convertToGrams(Double amount, String unit) {
        if (amount == null || amount <= 0) {
            return 0.0;
        }
        
        if (unit == null || unit.isBlank() || unit.equalsIgnoreCase("serving") || 
                unit.equalsIgnoreCase("servings")) {
            // Assume 100g for unitless or "serving" items
            return amount * 100.0;
        }
        
        String normalizedUnit = unit.toLowerCase().trim();
        
        // Weight units
        switch (normalizedUnit) {
            case "g", "gram", "grams" -> {
                return amount;
            }
            case "kg", "kilogram", "kilograms" -> {
                return amount * 1000.0;
            }
            case "oz", "ounce", "ounces" -> {
                return amount * 28.35;
            }
            case "lb", "pound", "pounds" -> {
                return amount * 453.592;
            }
        }

        // Volume units (approximate conversions)
        for (Map.Entry<String, Double> entry : VOLUME_TO_GRAMS.entrySet()) {
            if (normalizedUnit.contains(entry.getKey())) {
                return amount * entry.getValue();
            }
        }
        
        // Count-based units - assume 50g per item
        if (normalizedUnit.equals("clove") || normalizedUnit.equals("cloves") ||
                normalizedUnit.equals("piece") || normalizedUnit.equals("pieces") ||
                normalizedUnit.equals("whole")) {
            return amount * 50.0;
        }
        
        // Default: treat as 100g per unit for unknown units
        log.debug("Unknown unit '{}', using default weight estimation", unit);
        return amount * 100.0;
    }
    
    /**
     * Applies proportional reduction to nutrition info based on excluded proportion.
     * 
     * @param originalNutrition original nutrition info
     * @param proportion proportion to subtract (0.0 to 1.0)
     * @return updated nutrition info
     */
    private NutritionInfo applyProportionalReduction(NutritionInfo originalNutrition, double proportion) {
        if (originalNutrition == null || originalNutrition.getNutrients() == null) {
            log.warn("Original nutrition info is null or has no nutrients");
            return originalNutrition;
        }
        
        if (proportion <= 0.0) {
            log.debug("Proportion is zero or negative, returning original nutrition");
            return originalNutrition;
        }
        
        // Cap proportion at 1.0 (excluding everything)
        final double effectiveProportion = Math.min(proportion, 1.0);
        
        if (effectiveProportion >= 1.0) {
            log.warn("Proportion is >= 1.0 (excluding everything), returning zeroed nutrition");
        }
        
        List<Nutrient> updatedNutrients = originalNutrition.getNutrients().stream()
                .map(nutrient -> {
                    Double originalAmount = nutrient.amount();
                    Double newAmount = originalAmount * (1.0 - effectiveProportion);
                    return new Nutrient(nutrient.name(), newAmount, nutrient.unit());
                })
                .collect(Collectors.toList());
        
        NutritionInfo.CaloricBreakdown updatedBreakdown = 
                NutrientExtractor.recalculateCaloricBreakdown(updatedNutrients);
        
        log.debug("Applied {:.2%} reduction to nutrition values", effectiveProportion * 100);
        
        return NutritionInfo.builder()
                .nutrients(updatedNutrients)
                .caloricBreakdown(updatedBreakdown)
                .build();
    }
    
    /**
     * Calculates total nutrients from excluded ingredients (if nutrition data available).
     * 
     * <p>This method checks if ingredient-level nutrition data is available.
     * If not, returns an empty map to trigger proportional estimation fallback.
     * 
     * @param allIngredients all ingredients in the recipe
     * @param excludedIds IDs of ingredients to exclude
     * @return map of nutrient names to amounts to subtract (empty if no data available)
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
        
        if (!excludedNutrients.isEmpty()) {
            log.debug("Using ingredient-level nutrition data: {}", excludedNutrients);
        }
        
        return excludedNutrients;
    }
    
    /**
     * Recalculates nutrition info by subtracting excluded nutrients.
     * 
     * @param originalNutrition original nutrition info
     * @param nutrientsToSubtract map of nutrient amounts to subtract
     * @return updated nutrition info
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
                NutrientExtractor.recalculateCaloricBreakdown(updatedNutrients);
        
        return NutritionInfo.builder()
                .nutrients(updatedNutrients)
                .caloricBreakdown(updatedBreakdown)
                .build();
    }
}
