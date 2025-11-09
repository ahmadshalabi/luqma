package app.luqma.backend.service;

import app.luqma.backend.config.RecipeSearchProperties;
import app.luqma.backend.exception.ResourceLoadException;
import app.luqma.backend.model.dto.RecipeSearchResponse;
import app.luqma.backend.model.dto.RecipeSummary;
import app.luqma.backend.util.StringSanitizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for recipe search operations.
 * Loads mock data from classpath and provides search with pagination functionality.
 */
@Slf4j
@Service
public class RecipeSearchService {
    
    private final ObjectMapper objectMapper;
    private final RecipeSearchProperties recipeSearchProperties;
    private List<RecipeSummary> allRecipes;
    
    private static final String MOCK_DATA_PATH = "mocks/recipe-search-results.json";
    
    public RecipeSearchService(ObjectMapper objectMapper, RecipeSearchProperties recipeSearchProperties) {
        this.objectMapper = objectMapper;
        this.recipeSearchProperties = recipeSearchProperties;
    }
    
    /**
     * Initializes the service by loading mock recipe data.
     * Called automatically after bean construction.
     */
    @PostConstruct
    public void init() {
        loadMockData();
    }
    
    /**
     * Loads mock recipe data from classpath resource.
     * 
     * @throws ResourceLoadException if the mock data cannot be loaded
     */
    private void loadMockData() {
        try {
            ClassPathResource resource = new ClassPathResource(MOCK_DATA_PATH);
            
            if (!resource.exists()) {
                throw new ResourceLoadException("Mock data file not found: " + MOCK_DATA_PATH);
            }
            
            JsonNode rootNode = objectMapper.readTree(resource.getInputStream());
            JsonNode resultsNode = rootNode.get("results");
            
            if (resultsNode == null || !resultsNode.isArray()) {
                throw new ResourceLoadException("Invalid mock data format: 'results' array not found");
            }
            
            allRecipes = new ArrayList<>();
            for (JsonNode recipeNode : resultsNode) {
                RecipeSummary recipe = new RecipeSummary(
                        recipeNode.get("id").asLong(),
                        recipeNode.get("title").asText(),
                        recipeNode.get("image").asText()
                );
                allRecipes.add(recipe);
            }
            
            log.info("Successfully loaded {} recipes from mock data", allRecipes.size());
            
        } catch (IOException e) {
            log.error("Failed to load mock data from {}", MOCK_DATA_PATH, e);
            throw new ResourceLoadException("Failed to load recipe mock data", e);
        }
    }
    
    /**
     * Searches for recipes based on query and returns paginated results.
     * Note: Validation is performed at the controller layer.
     * 
     * @param query the search query (case-insensitive substring match on title)
     * @param page the page number (1-indexed)
     * @param pageSize the number of results per page
     * @return paginated search results
     */
    public RecipeSearchResponse searchRecipes(String query, int page, int pageSize) {
        long startTime = System.currentTimeMillis();
        
        // Cap page size at maximum allowed (validation already done at controller level)
        int maxPageSize = recipeSearchProperties.getMaxPageSize();
        int effectivePageSize = Math.min(pageSize, maxPageSize);
        if (effectivePageSize < pageSize) {
            log.warn("Page size {} exceeds maximum {}, capping at {}", pageSize, maxPageSize, maxPageSize);
        }
        
        // Sanitize and normalize query
        String sanitizedQuery = StringSanitizer.sanitizeForQuery(query);
        
        // Filter recipes by query (case-insensitive substring match on title)
        List<RecipeSummary> filteredRecipes = filterRecipesByQuery(sanitizedQuery);
        
        log.debug("Search query: '{}', Total matches: {}, Page: {}, PageSize: {}", 
                sanitizedQuery, filteredRecipes.size(), page, effectivePageSize);
        
        // Apply pagination (1-indexed pages)
        int totalResults = filteredRecipes.size();
        int offset = (page - 1) * effectivePageSize;
        
        // Handle case where page is beyond available results
        List<RecipeSummary> paginatedResults;
        if (offset >= totalResults) {
            paginatedResults = new ArrayList<>();
            log.debug("Page {} beyond available results (total: {}), returning empty results", page, totalResults);
        } else {
            int endIndex = Math.min(offset + effectivePageSize, totalResults);
            paginatedResults = filteredRecipes.subList(offset, endIndex);
        }
        
        RecipeSearchResponse response = new RecipeSearchResponse(
                paginatedResults,
                page,
                effectivePageSize,
                totalResults
        );
        
        long duration = System.currentTimeMillis() - startTime;
        if (duration > 200) {
            log.warn("Slow query detected: '{}' took {}ms", sanitizedQuery, duration);
        }
        
        log.info("Search completed: query='{}', matches={}, returned={}, page={}, duration={}ms", 
                sanitizedQuery, totalResults, paginatedResults.size(), page, duration);
        
        return response;
    }
    
    /**
     * Filters recipes by query string (case-insensitive substring match on title).
     * 
     * @param query the sanitized search query
     * @return list of matching recipes
     */
    private List<RecipeSummary> filterRecipesByQuery(String query) {
        if (query == null || query.isBlank()) {
            log.warn("Empty or null query provided, but query is required");
            return new ArrayList<>();
        }
        
        String lowercaseQuery = query.toLowerCase();
        
        List<RecipeSummary> matches = allRecipes.stream()
                .filter(recipe -> recipe.title().toLowerCase().contains(lowercaseQuery))
                .collect(Collectors.toList());
        
        if (matches.isEmpty()) {
            log.debug("No recipes found matching query: '{}'", query);
        }
        
        return matches;
    }
}

