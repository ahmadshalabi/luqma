package app.luqma.backend.client;

import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.model.dto.spoonacular.SpoonacularSearchResponse;

/**
 * Interface for recipe API clients.
 * 
 * <p>Provides abstraction over recipe data sources, allowing different
 * implementations for production (real API) and testing/development (mock data).
 * 
 * <p><strong>Implementations:</strong>
 * <ul>
 *   <li>{@link SpoonacularClient} - Real Spoonacular API integration</li>
 *   <li>{@link MockSpoonacularClient} - Mock data for testing/offline development</li>
 * </ul>
 */
public interface RecipeApiClient {
    
    /**
     * Searches for recipes.
     * 
     * @param query search query (recipe title or keywords)
     * @param number number of results to return (page size)
     * @param offset starting position in result set (pagination offset)
     * @return search response with recipe results and pagination info
     * @throws app.luqma.backend.exception.ExternalApiException if API call fails
     * @throws IllegalArgumentException if query is null or blank, or if number/offset are negative
     */
    SpoonacularSearchResponse searchRecipes(String query, int number, int offset);
    
    /**
     * Retrieves detailed information for a specific recipe.
     * 
     * @param id recipe ID
     * @return detailed recipe information
     * @throws app.luqma.backend.exception.ExternalApiException if API call fails
     * @throws IllegalArgumentException if ID is null or invalid (≤ 0)
     */
    RecipeDetail getRecipeInformation(Long id);
}

