package app.luqma.backend.client;

import app.luqma.backend.config.MockProperties;
import app.luqma.backend.exception.ExternalApiException;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.model.dto.spoonacular.SpoonacularSearchResponse;
import app.luqma.backend.model.dto.spoonacular.SpoonacularSearchResponse.SpoonacularRecipeSummary;
import app.luqma.backend.util.MockDataLoader;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * Mock implementation of Spoonacular API client for testing and offline development.
 * 
 * <p>This client mimics the behavior of {@link SpoonacularClient} but uses local
 * mock data instead of making real API calls. It supports:
 * <ul>
 *   <li>Recipe search with title-based filtering</li>
 *   <li>Recipe details from JSON files</li>
 *   <li>Configurable latency simulation</li>
 *   <li>Configurable error injection</li>
 *   <li>Same validation and error handling as real client</li>
 * </ul>
 * 
 * <p><strong>Active Profile:</strong> Only active when "mock" profile is enabled.
 * 
 * @see SpoonacularClient
 * @see MockProperties
 */
@Slf4j
@Component
@Profile("mock")
public class MockSpoonacularClient implements RecipeApiClient {
    
    private static final String SERVICE_NAME = "Mock Spoonacular API";
    
    private final ObjectMapper objectMapper;
    private final MockProperties mockProperties;
    private final Random random;
    
    private SpoonacularSearchResponse allRecipes;
    
    public MockSpoonacularClient(ObjectMapper objectMapper, MockProperties mockProperties) {
        this.objectMapper = objectMapper;
        this.mockProperties = mockProperties;
        this.random = new Random();
        log.info("MockSpoonacularClient initialized - API calls will use local mock data");
    }
    
    /**
     * Loads mock search results at initialization.
     */
    @PostConstruct
    public void init() {
        try {
            allRecipes = MockDataLoader.loadMockData(
                    "recipe-search-results.json",
                    objectMapper,
                    new TypeReference<SpoonacularSearchResponse>() {}
            );
            log.info("Loaded {} mock recipes for search", allRecipes.getResults().size());
        } catch (Exception e) {
            log.error("Failed to load mock search data", e);
            throw new IllegalStateException("Failed to initialize mock client", e);
        }
    }
    
    /**
     * Searches for recipes using mock data with title-based filtering.
     * 
     * <p>Filters recipes where the query text is found in the recipe title
     * (case-insensitive substring match).
     * 
     * @param query search query (recipe title or keywords)
     * @param number number of results to return (page size)
     * @param offset starting position in result set (pagination offset)
     * @return search response with filtered recipe results and pagination info
     * @throws ExternalApiException if error simulation is triggered
     * @throws IllegalArgumentException if query is null or blank, or if number/offset are negative
     */
    public SpoonacularSearchResponse searchRecipes(String query, int number, int offset) {
        validateSearchParams(query, number, offset);
        
        log.debug("Searching recipes: query='{}', number={}, offset={}", query, number, offset);
        
        // Simulate errors if configured
        simulateErrorIfConfigured();
        
        // Simulate latency if configured
        simulateLatencyIfConfigured();
        
        // Filter recipes by title
        String lowerQuery = query.toLowerCase();
        List<SpoonacularRecipeSummary> filteredResults = allRecipes.getResults().stream()
                .filter(recipe -> recipe.getTitle().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
        
        int totalResults = filteredResults.size();
        
        // Apply pagination
        List<SpoonacularRecipeSummary> paginatedResults = filteredResults.stream()
                .skip(offset)
                .limit(number)
                .collect(Collectors.toList());
        
        SpoonacularSearchResponse response = new SpoonacularSearchResponse();
        response.setResults(paginatedResults);
        response.setTotalResults(totalResults);
        response.setOffset(offset);
        response.setNumber(paginatedResults.size());
        
        log.info("Recipe search successful: query='{}', total={}, returned={}", 
                query, totalResults, paginatedResults.size());
        
        return response;
    }
    
    /**
     * Retrieves detailed information for a specific recipe from mock data.
     * 
     * <p>Loads recipe from file: {@code recipe-{id}.json}
     * 
     * @param id recipe ID
     * @return detailed recipe information
     * @throws ExternalApiException if API call fails or recipe not found
     * @throws IllegalArgumentException if ID is null or invalid (≤ 0)
     */
    public RecipeDetail getRecipeInformation(Long id) {
        validateRecipeId(id);
        
        log.debug("Fetching recipe information: id={}", id);
        
        // Simulate errors if configured
        simulateErrorIfConfigured();
        
        // Simulate latency if configured
        simulateLatencyIfConfigured();
        
        try {
            String fileName = "recipe-" + id + ".json";
            RecipeDetail recipe = MockDataLoader.loadMockDataOrNull(
                    fileName,
                    objectMapper,
                    RecipeDetail.class
            );
            
            if (recipe == null) {
                log.debug("Recipe not found in mock data: id={}", id);
                throw new ExternalApiException(
                        "Recipe with ID " + id + " not found",
                        404, SERVICE_NAME);
            }
            
            log.info("Recipe information retrieved successfully: id={}, title='{}'", 
                    id, recipe.getTitle());
            
            return recipe;
            
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error fetching mock recipe {}", id, e);
            throw new ExternalApiException(
                    "Unexpected error while fetching recipe: " + e.getMessage(),
                    0, SERVICE_NAME, e);
        }
    }
    
    /**
     * Validates search parameters.
     */
    private void validateSearchParams(String query, int number, int offset) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Search query must not be null or blank");
        }
        if (number < 0) {
            throw new IllegalArgumentException("Number of results must not be negative");
        }
        if (offset < 0) {
            throw new IllegalArgumentException("Offset must not be negative");
        }
    }
    
    /**
     * Validates recipe ID.
     */
    private void validateRecipeId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Recipe ID must not be null");
        }
        if (id <= 0) {
            throw new IllegalArgumentException("Recipe ID must be positive");
        }
    }
    
    /**
     * Simulates network latency if configured.
     * Adds random delay between min and max milliseconds.
     */
    private void simulateLatencyIfConfigured() {
        if (!mockProperties.getLatency().isEnabled()) {
            return;
        }
        
        int minMillis = mockProperties.getLatency().getMinMillis();
        int maxMillis = mockProperties.getLatency().getMaxMillis();
        
        if (minMillis < 0 || maxMillis < minMillis) {
            log.warn("Invalid latency configuration: min={}, max={}", minMillis, maxMillis);
            return;
        }
        
        int latencyMillis = minMillis + random.nextInt(maxMillis - minMillis + 1);
        
        log.debug("Simulating API latency: {}ms", latencyMillis);
        
        try {
            Thread.sleep(latencyMillis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Latency simulation interrupted", e);
        }
    }
    
    /**
     * Simulates API errors if configured.
     * Throws ExternalApiException based on configured error rate.
     */
    private void simulateErrorIfConfigured() {
        if (!mockProperties.getErrors().isEnabled()) {
            return;
        }
        
        double errorRate = mockProperties.getErrors().getRate();
        
        if (errorRate <= 0.0) {
            return;
        }
        
        if (errorRate > 1.0) {
            log.warn("Invalid error rate: {} (should be 0.0-1.0)", errorRate);
            errorRate = 1.0;
        }
        
        if (random.nextDouble() < errorRate) {
            log.debug("Simulating API error (rate: {})", errorRate);
            
            // Simulate various error types
            int errorType = random.nextInt(3);
            switch (errorType) {
                case 0:
                    throw new ExternalApiException(
                            "Rate limit exceeded. Please try again later.",
                            429, SERVICE_NAME);
                case 1:
                    throw new ExternalApiException(
                            SERVICE_NAME + " server error (HTTP 500)",
                            500, SERVICE_NAME);
                default:
                    throw new ExternalApiException(
                            SERVICE_NAME + " server error (HTTP 503)",
                            503, SERVICE_NAME);
            }
        }
    }
}

