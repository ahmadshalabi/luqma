package app.luqma.backend.mapper;

import app.luqma.backend.constants.NutrientNames;
import app.luqma.backend.model.domain.Nutrient;
import app.luqma.backend.model.domain.NutritionInfo;
import app.luqma.backend.model.dto.NutritionDTO;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

/**
 * Utility class for extracting and processing nutrient information.
 * Centralizes nutrient extraction logic to eliminate duplication across services.
 */
public final class NutrientExtractor {
    
    private NutrientExtractor() {
        throw new UnsupportedOperationException("Utility class - do not instantiate");
    }
    
    /**
     * Finds the amount of a specific nutrient by name from a list of nutrients.
     * Case-insensitive name matching.
     * 
     * @param nutrients list of nutrients to search
     * @param name name of the nutrient to find
     * @return the amount of the nutrient, or 0.0 if not found
     */
    public static Double findNutrientAmount(List<Nutrient> nutrients, String name) {
        if (nutrients == null || name == null) {
            return 0.0;
        }
        
        return nutrients.stream()
                .filter(n -> name.equalsIgnoreCase(n.name()))
                .findFirst()
                .map(Nutrient::amount)
                .orElse(0.0);
    }
    
    /**
     * Extracts nutrition information from a NutritionInfo object and converts to DTO.
     * Returns empty DTO if nutrition info is null or has no nutrients.
     * 
     * @param nutritionInfo the nutrition info object from domain model
     * @return NutritionDTO with extracted nutrient values
     */
    public static NutritionDTO extractNutritionDTO(NutritionInfo nutritionInfo) {
        if (nutritionInfo == null || nutritionInfo.getNutrients() == null) {
            return createEmptyNutritionDTO();
        }
        
        var nutrients = nutritionInfo.getNutrients();
        var breakdown = nutritionInfo.getCaloricBreakdown();
        
        return new NutritionDTO(
                findNutrientAmount(nutrients, NutrientNames.CALORIES),
                findNutrientAmount(nutrients, NutrientNames.PROTEIN),
                findNutrientAmount(nutrients, NutrientNames.FAT),
                findNutrientAmount(nutrients, NutrientNames.CARBOHYDRATES),
                findNutrientAmount(nutrients, NutrientNames.FIBER),
                getBreakdownValue(breakdown, b -> b.percentProtein()),
                getBreakdownValue(breakdown, b -> b.percentFat()),
                getBreakdownValue(breakdown, b -> b.percentCarbs())
        );
    }
    
    /**
     * Creates an empty nutrition DTO with all values set to 0.0.
     * 
     * @return empty NutritionDTO
     */
    public static NutritionDTO createEmptyNutritionDTO() {
        return new NutritionDTO(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    }
    
    /**
     * Safely extracts a value from caloric breakdown.
     * Returns 0.0 if breakdown is null.
     * 
     * @param breakdown the caloric breakdown object
     * @param extractor function to extract the desired value
     * @return the extracted value or 0.0 if breakdown is null
     */
    private static Double getBreakdownValue(
            NutritionInfo.CaloricBreakdown breakdown,
            Function<NutritionInfo.CaloricBreakdown, Double> extractor) {
        return Optional.ofNullable(breakdown)
                .map(extractor)
                .orElse(0.0);
    }
    
    /**
     * Recalculates caloric breakdown percentages based on macronutrient amounts.
     * Uses the 4-4-9 rule: protein and carbs = 4 cal/g, fat = 9 cal/g.
     * 
     * @param nutrients list of nutrients containing protein, fat, and carbohydrate values
     * @return recalculated caloric breakdown
     */
    public static NutritionInfo.CaloricBreakdown recalculateCaloricBreakdown(List<Nutrient> nutrients) {
        Double protein = findNutrientAmount(nutrients, NutrientNames.PROTEIN);
        Double fat = findNutrientAmount(nutrients, NutrientNames.FAT);
        Double carbs = findNutrientAmount(nutrients, NutrientNames.CARBOHYDRATES);
        
        double proteinCalories = protein * 4;
        double fatCalories = fat * 9;
        double carbCalories = carbs * 4;
        double totalCalories = proteinCalories + fatCalories + carbCalories;
        
        double percentProtein = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0.0;
        double percentFat = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0.0;
        double percentCarbs = totalCalories > 0 ? (carbCalories / totalCalories) * 100 : 0.0;
        
        return new NutritionInfo.CaloricBreakdown(percentProtein, percentFat, percentCarbs);
    }
}

