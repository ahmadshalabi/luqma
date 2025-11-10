package app.luqma.backend.service;

import app.luqma.backend.config.RecipeSearchProperties;
import app.luqma.backend.exception.ResourceLoadException;
import app.luqma.backend.model.dto.RecipeSearchResponse;
import app.luqma.backend.model.dto.RecipeSummary;
import app.luqma.backend.util.MockDataLoader;
import app.luqma.backend.util.StringSanitizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for recipe search operations with optimized indexed search.
 * Loads mock data from classpath and provides fast O(1) search with pagination.
 * 
 * Performance: Uses tokenized index for sub-second search across all recipes.
 */
@Slf4j
@Service
public class RecipeSearchService {
    
    private final ObjectMapper objectMapper;
    private final RecipeSearchProperties recipeSearchProperties;
    
    // Recipe storage
    private List<RecipeSummary> allRecipes;
    
    // Search index: token -> list of recipe IDs containing that token
    private Map<String, Set<Long>> tokenIndex;
    
    private static final String MOCK_DATA_FILE = "recipe-search-results.json";
    
    public RecipeSearchService(ObjectMapper objectMapper, RecipeSearchProperties recipeSearchProperties) {
        this.objectMapper = objectMapper;
        this.recipeSearchProperties = recipeSearchProperties;
    }
    
    @PostConstruct
    public void init() {
        loadMockData();
        buildSearchIndex();
    }
    
    /**
     * Loads mock recipe data from classpath resource.
     */
    private void loadMockData() {
        JsonNode rootNode = MockDataLoader.loadMockData(
                MOCK_DATA_FILE, 
                objectMapper, 
                JsonNode.class
        );
        
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
    }
    
    /**
     * Builds an inverted index for fast recipe search.
     * Tokenizes recipe titles and creates token -> recipe ID mappings.
     * Enables O(1) average case lookup instead of O(n) linear search.
     */
    private void buildSearchIndex() {
        tokenIndex = new HashMap<>();
        
        for (RecipeSummary recipe : allRecipes) {
            Set<String> tokens = tokenize(recipe.title());
            
            for (String token : tokens) {
                tokenIndex.computeIfAbsent(token, k -> new HashSet<>()).add(recipe.id());
            }
        }
        
        log.info("Built search index with {} unique tokens for {} recipes", 
                tokenIndex.size(), allRecipes.size());
    }
    
    /**
     * Tokenizes text into searchable tokens.
     * Converts to lowercase, splits on non-alphanumeric characters.
     * 
     * @param text text to tokenize
     * @return set of tokens
     */
    private Set<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return Set.of();
        }
        
        return Arrays.stream(text.toLowerCase().split("[^a-z0-9]+"))
                .filter(token -> !token.isEmpty())
                .collect(Collectors.toSet());
    }
    
    /**
     * Searches for recipes based on query and returns paginated results.
     * Uses indexed search for O(1) average case performance.
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
            log.warn("Page size {} exceeds maximum {}, capping at {}", pageSize, maxPageSize, maxPageSize);
        }
        
        String sanitizedQuery = StringSanitizer.sanitizeForQuery(query);
        List<RecipeSummary> filteredRecipes = searchRecipesByIndex(sanitizedQuery);
        
        log.debug("Search query: '{}', Total matches: {}, Page: {}, PageSize: {}", 
                sanitizedQuery, filteredRecipes.size(), page, effectivePageSize);
        
        int totalResults = filteredRecipes.size();
        int offset = (page - 1) * effectivePageSize;
        
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
        if (duration > 100) {
            log.warn("Slow query detected: '{}' took {}ms", sanitizedQuery, duration);
        }
        
        log.info("Search completed: query='{}', matches={}, returned={}, page={}, duration={}ms", 
                sanitizedQuery, totalResults, paginatedResults.size(), page, duration);
        
        return response;
    }
    
    /**
     * Searches recipes using the inverted index for fast lookup.
     * Tokenizes query and finds recipes containing ALL query tokens (AND search).
     * Falls back to substring search if no tokens found in index.
     * 
     * @param query the sanitized search query
     * @return list of matching recipes
     */
    private List<RecipeSummary> searchRecipesByIndex(String query) {
        if (query == null || query.isBlank()) {
            log.warn("Empty or null query provided, but query is required");
            return new ArrayList<>();
        }
        
        Set<String> queryTokens = tokenize(query);
        
        if (queryTokens.isEmpty()) {
            log.debug("No valid tokens in query: '{}'", query);
            return new ArrayList<>();
        }
        
        Set<Long> matchingRecipeIds = null;
        
        for (String token : queryTokens) {
            Set<Long> recipesWithToken = tokenIndex.getOrDefault(token, Set.of());
            
            if (matchingRecipeIds == null) {
                matchingRecipeIds = new HashSet<>(recipesWithToken);
            } else {
                matchingRecipeIds.retainAll(recipesWithToken);
            }
            
            if (matchingRecipeIds.isEmpty()) {
                log.debug("No recipes found matching all tokens in query: '{}'", query);
                return List.of();
            }
        }
        
        if (matchingRecipeIds == null || matchingRecipeIds.isEmpty()) {
            return List.of();
        }
        
        final Set<Long> finalMatchingIds = matchingRecipeIds;
        
        List<RecipeSummary> matches = allRecipes.stream()
                .filter(recipe -> finalMatchingIds.contains(recipe.id()))
                .collect(Collectors.toList());
        
        if (matches.isEmpty()) {
            log.debug("No recipes found matching query: '{}'", query);
        }
        
        return matches;
    }
}

