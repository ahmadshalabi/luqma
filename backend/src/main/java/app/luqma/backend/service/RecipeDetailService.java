package app.luqma.backend.service;

import app.luqma.backend.exception.ResourceNotFoundException;
import app.luqma.backend.model.domain.ExtendedIngredient;
import app.luqma.backend.model.domain.Nutrient;
import app.luqma.backend.model.domain.NutritionInfo;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.model.dto.IngredientDTO;
import app.luqma.backend.model.dto.NutritionDTO;
import app.luqma.backend.model.dto.RecipeDetailResponse;
import app.luqma.backend.util.MockDataLoader;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Service for managing recipe details.
 * Loads mock recipe data on initialization and provides recipe detail operations.
 */
@Slf4j
@Service
public class RecipeDetailService {
    
    private final ObjectMapper objectMapper;
    private final Map<Long, RecipeDetail> recipeCache;
    
    private static final List<String> RECIPE_FILES = List.of(
            "recipe-642539.json",
            "recipe-654812.json",
            "recipe-715497.json",
            "recipe-782601.json"
    );
    
    public RecipeDetailService(ObjectMapper objectMapper) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "ObjectMapper cannot be null");
        this.recipeCache = new ConcurrentHashMap<>();
    }
    
    @PostConstruct
    public void init() {
        loadAllRecipes();
    }
    
    private void loadAllRecipes() {
        log.info("Loading recipe detail mock data...");
        
        int successCount = 0;
        int failureCount = 0;
        
        for (var fileName : RECIPE_FILES) {
            try {
                loadRecipeFile(fileName);
                successCount++;
            } catch (Exception e) {
                log.error("Failed to load recipe file: {}", fileName, e);
                failureCount++;
            }
        }
        
        log.info("Recipe loading complete. Success: {}, Failures: {}, Total cached: {}", 
                successCount, failureCount, recipeCache.size());
    }
    
    private void loadRecipeFile(String fileName) {
        var recipeDetail = MockDataLoader.loadMockDataOrNull(fileName, objectMapper, RecipeDetail.class);
        
        if (recipeDetail == null) {
            log.warn("Recipe file not found: {}", fileName);
            return;
        }
        
        if (recipeDetail.getId() == null) {
            log.warn("Recipe in file {} has no ID, skipping", fileName);
            return;
        }
        
        recipeCache.put(recipeDetail.getId(), recipeDetail);
        log.debug("Loaded recipe: ID={}, Title={}", recipeDetail.getId(), recipeDetail.getTitle());
    }
    
    /**
     * Retrieves a recipe by ID.
     *
     * @throws ResourceNotFoundException if recipe not found
     * @throws IllegalArgumentException if ID is null or invalid
     */
    public RecipeDetailResponse getRecipeById(Long id) {
        Objects.requireNonNull(id, "Recipe ID cannot be null");
        
        if (id <= 0) {
            log.warn("Invalid recipe ID requested: {}", id);
            throw new IllegalArgumentException("Recipe ID must be positive");
        }
        
        log.debug("Fetching recipe with ID: {}", id);
        
        return Optional.ofNullable(recipeCache.get(id))
                .map(this::mapToResponse)
                .orElseThrow(() -> {
                    log.warn("Recipe not found: {}", id);
                    return ResourceNotFoundException.forRecipe(id);
                });
    }
    
    private RecipeDetailResponse mapToResponse(RecipeDetail recipe) {
        log.debug("Mapping recipe to response DTO: {}", recipe.getId());
        
        var ingredients = Optional.ofNullable(recipe.getExtendedIngredients())
                .orElse(List.of())
                .stream()
                .map(this::mapIngredient)
                .collect(Collectors.toList());
        
        var nutritionDTO = extractNutrition(recipe);
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
    
    private IngredientDTO mapIngredient(ExtendedIngredient ingredient) {
        return new IngredientDTO(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getAmount(),
                ingredient.getUnit()
        );
    }
    
    private NutritionDTO extractNutrition(RecipeDetail recipe) {
        if (recipe.getNutrition() == null || recipe.getNutrition().getNutrients() == null) {
            log.debug("No nutrition data available for recipe: {}", recipe.getId());
            return createEmptyNutritionDTO();
        }
        
        var nutrients = recipe.getNutrition().getNutrients();
        var breakdown = recipe.getNutrition().getCaloricBreakdown();
        
        return new NutritionDTO(
                findNutrientAmount(nutrients, "Calories"),
                findNutrientAmount(nutrients, "Protein"),
                findNutrientAmount(nutrients, "Fat"),
                findNutrientAmount(nutrients, "Carbohydrates"),
                findNutrientAmount(nutrients, "Fiber"),
                getBreakdownValue(breakdown, b -> b.percentProtein()),
                getBreakdownValue(breakdown, b -> b.percentFat()),
                getBreakdownValue(breakdown, b -> b.percentCarbs())
        );
    }
    
    private NutritionDTO createEmptyNutritionDTO() {
        return new NutritionDTO(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    }
    
    private Double getBreakdownValue(
            NutritionInfo.CaloricBreakdown breakdown,
            java.util.function.Function<NutritionInfo.CaloricBreakdown, Double> extractor) {
        return Optional.ofNullable(breakdown)
                .map(extractor)
                .orElse(0.0);
    }
    
    private Double findNutrientAmount(List<Nutrient> nutrients, String name) {
        return nutrients.stream()
                .filter(n -> name.equalsIgnoreCase(n.name()))
                .findFirst()
                .map(Nutrient::amount)
                .orElse(0.0);
    }
    
    private List<String> extractInstructions(RecipeDetail recipe) {
        var analyzedInstructions = recipe.getAnalyzedInstructions();
        if (analyzedInstructions != null && !analyzedInstructions.isEmpty()) {
            return analyzedInstructions.stream()
                    .flatMap(ai -> ai.getSteps().stream())
                    .map(step -> step.number() + ". " + step.step())
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
    
    public Set<Long> getAllRecipeIds() {
        return new HashSet<>(recipeCache.keySet());
    }
}

