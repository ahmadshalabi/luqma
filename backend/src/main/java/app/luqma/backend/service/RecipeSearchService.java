package app.luqma.backend.service;

import app.luqma.backend.client.SpoonacularClient;
import app.luqma.backend.config.RecipeSearchProperties;
import app.luqma.backend.mapper.RecipeMapper;
import app.luqma.backend.model.dto.RecipeSearchResponse;
import app.luqma.backend.model.dto.spoonacular.SpoonacularSearchResponse;
import app.luqma.backend.util.StringSanitizer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for recipe search operations using Spoonacular API.
 * 
 * <p>Handles recipe search with pagination and query sanitization.
 * Delegates to {@link SpoonacularClient} for external API calls.
 */
@Slf4j
@Service
public class RecipeSearchService {
    
    private final SpoonacularClient spoonacularClient;
    private final RecipeSearchProperties recipeSearchProperties;
    
    public RecipeSearchService(
            SpoonacularClient spoonacularClient,
            RecipeSearchProperties recipeSearchProperties) {
        this.spoonacularClient = spoonacularClient;
        this.recipeSearchProperties = recipeSearchProperties;
    }
    
    /**
     * Searches for recipes based on query and returns paginated results.
     * 
     * <p>Sanitizes query, enforces max page size, and delegates to Spoonacular API.
     * Note: Validation is performed at the controller layer.
     * 
     * @param query the search query (case-insensitive token-based match on title)
     * @param page the page number (1-indexed)
     * @param pageSize the number of results per page
     * @return paginated search results
     */
    public RecipeSearchResponse searchRecipes(String query, int page, int pageSize) {
        long startTime = System.currentTimeMillis();
        
        int maxPageSize = recipeSearchProperties.getMaxPageSize();
        int effectivePageSize = Math.min(pageSize, maxPageSize);
        if (effectivePageSize < pageSize) {
            log.warn("Page size {} exceeds maximum {}, capping at {}", 
                    pageSize, maxPageSize, maxPageSize);
        }
        
        String sanitizedQuery = StringSanitizer.sanitizeForQuery(query);
        
        if (sanitizedQuery.isBlank()) {
            log.warn("Empty or null query provided after sanitization");
            return new RecipeSearchResponse(
                    java.util.List.of(), 
                    page, 
                    effectivePageSize, 
                    0
            );
        }
        
        int offset = (page - 1) * effectivePageSize;
        
        log.debug("Search query: '{}', Page: {}, PageSize: {}, Offset: {}", 
                sanitizedQuery, page, effectivePageSize, offset);
        
        SpoonacularSearchResponse spoonacularResponse = spoonacularClient.searchRecipes(
                sanitizedQuery, effectivePageSize, offset);
        
        RecipeSearchResponse response = RecipeMapper.toRecipeSearchResponse(
                spoonacularResponse, page, effectivePageSize);
        
        long duration = System.currentTimeMillis() - startTime;
        if (duration > 100) {
            log.warn("Slow query detected: '{}' took {}ms", sanitizedQuery, duration);
        }
        
        log.info("Search completed: query='{}', total={}, returned={}, page={}, duration={}ms", 
                sanitizedQuery, response.totalResults(), response.results().size(), 
                page, duration);
        
        return response;
    }
}
