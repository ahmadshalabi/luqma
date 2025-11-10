package app.luqma.backend.repository;

import app.luqma.backend.client.RecipeApiClient;
import app.luqma.backend.constants.ErrorMessages;
import app.luqma.backend.exception.ResourceNotFoundException;
import app.luqma.backend.model.domain.RecipeDetail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import java.util.Objects;
import java.util.Optional;

/**
 * Repository for managing recipe data access.
 * 
 * <p>Delegates to {@link RecipeApiClient} for fetching recipe data from the API.
 * Uses Spring Cache to minimize redundant API calls.
 * 
 * <p><strong>Caching Strategy:</strong>
 * Recipe details are cached by ID to avoid repeated API calls for the same recipe.
 * Cache is managed by Spring's caching abstraction.
 * 
 * @see RecipeApiClient
 */
@Slf4j
@Repository
public class RecipeRepository {
    
    private final RecipeApiClient recipeApiClient;
    
    public RecipeRepository(RecipeApiClient recipeApiClient) {
        this.recipeApiClient = Objects.requireNonNull(recipeApiClient, 
                "RecipeApiClient cannot be null");
        log.info("RecipeRepository initialized with recipe API integration");
    }
    
    /**
     * Finds a recipe by ID.
     * 
     * <p>Results are cached to minimize API calls. Subsequent requests for the same
     * recipe ID will be served from cache.
     * 
     * @param id the recipe ID
     * @return Optional containing the recipe if found, empty otherwise
     * @throws IllegalArgumentException if ID is null or invalid
     */
    @Cacheable(value = "recipes", key = "#id", unless = "#result == null || #result.isEmpty()")
    public Optional<RecipeDetail> findById(Long id) {
        Objects.requireNonNull(id, ErrorMessages.RECIPE_ID_NULL);
        
        if (id <= 0) {
            log.warn("Invalid recipe ID requested: {}", id);
            throw new IllegalArgumentException(ErrorMessages.RECIPE_ID_POSITIVE);
        }
        
        log.debug("Fetching recipe from API: id={}", id);
        
        try {
            RecipeDetail recipe = recipeApiClient.getRecipeInformation(id);
            log.debug("Recipe fetched successfully: id={}, title='{}'", id, recipe.getTitle());
            return Optional.of(recipe);
        } catch (app.luqma.backend.exception.ExternalApiException e) {
            if (e.getStatusCode() == 404) {
                log.debug("Recipe not found in API: id={}", id);
                return Optional.empty();
            }
            log.error("Failed to fetch recipe from API: id={}", id, e);
            throw e;
        }
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
     * Checks if a recipe exists with the given ID.
     * 
     * <p><strong>Note:</strong> This method makes an API call to verify existence.
     * Use sparingly as it counts toward API rate limits.
     * 
     * @param id the recipe ID
     * @return true if recipe exists, false otherwise
     */
    public boolean existsById(Long id) {
        if (id == null || id <= 0) {
            return false;
        }
        
        try {
            return findById(id).isPresent();
        } catch (Exception e) {
            log.debug("Error checking recipe existence: id={}", id, e);
            return false;
        }
    }
}

