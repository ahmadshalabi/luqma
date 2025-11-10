package app.luqma.backend.repository;

import app.luqma.backend.constants.ErrorMessages;
import app.luqma.backend.exception.ResourceNotFoundException;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.util.MockDataLoader;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Repository for managing recipe data storage and retrieval.
 * Currently uses mock data loaded from classpath resources.
 * 
 * Responsibilities:
 * - Load mock recipe data on initialization
 * - Cache recipe details in memory
 * - Provide data access methods
 * 
 * Future: Can be replaced with database repository implementation.
 */
@Slf4j
@Repository
public class MockRecipeRepository {
    
    private final ObjectMapper objectMapper;
    private final Map<Long, RecipeDetail> recipeCache;
    
    private static final List<String> RECIPE_FILES = List.of(
            "recipe-642539.json",
            "recipe-654812.json",
            "recipe-715497.json",
            "recipe-782601.json"
    );
    
    public MockRecipeRepository(ObjectMapper objectMapper) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "ObjectMapper cannot be null");
        this.recipeCache = new ConcurrentHashMap<>();
    }
    
    /**
     * Initializes the repository by loading all mock recipe data.
     */
    @PostConstruct
    public void init() {
        loadAllRecipes();
    }
    
    /**
     * Loads all recipe files from classpath resources.
     */
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
    
    /**
     * Loads a single recipe file and caches it.
     * 
     * @param fileName name of the recipe JSON file
     */
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
     * Finds a recipe by ID.
     * 
     * @param id the recipe ID
     * @return Optional containing the recipe if found, empty otherwise
     * @throws IllegalArgumentException if ID is null or invalid
     */
    public Optional<RecipeDetail> findById(Long id) {
        Objects.requireNonNull(id, ErrorMessages.RECIPE_ID_NULL);
        
        if (id <= 0) {
            log.warn("Invalid recipe ID requested: {}", id);
            throw new IllegalArgumentException(ErrorMessages.RECIPE_ID_POSITIVE);
        }
        
        log.debug("Fetching recipe with ID: {}", id);
        return Optional.ofNullable(recipeCache.get(id));
    }
    
    /**
     * Gets a recipe by ID, throwing exception if not found.
     * 
     * @param id the recipe ID
     * @return the recipe detail
     * @throws ResourceNotFoundException if recipe not found
     * @throws IllegalArgumentException if ID is null or invalid
     */
    public RecipeDetail getById(Long id) {
        return findById(id)
                .orElseThrow(() -> {
                    log.warn("Recipe not found: {}", id);
                    return ResourceNotFoundException.forRecipe(id);
                });
    }
    
    /**
     * Gets all recipe IDs currently in the repository.
     * 
     * @return set of all recipe IDs
     */
    public Set<Long> getAllRecipeIds() {
        return new HashSet<>(recipeCache.keySet());
    }
    
    /**
     * Checks if a recipe exists with the given ID.
     * 
     * @param id the recipe ID
     * @return true if recipe exists, false otherwise
     */
    public boolean existsById(Long id) {
        return id != null && recipeCache.containsKey(id);
    }
    
    /**
     * Gets the total number of recipes in the repository.
     * 
     * @return count of recipes
     */
    public long count() {
        return recipeCache.size();
    }
}

