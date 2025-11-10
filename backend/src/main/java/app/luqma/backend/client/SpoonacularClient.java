package app.luqma.backend.client;

import app.luqma.backend.exception.ExternalApiException;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.model.dto.spoonacular.SpoonacularSearchResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.util.Objects;

/**
 * HTTP client for Spoonacular API integration.
 * 
 * <p>Handles all communication with the Spoonacular API including:
 * <ul>
 *   <li>Recipe search via complexSearch endpoint</li>
 *   <li>Recipe details via information endpoint</li>
 *   <li>Error handling and mapping to application exceptions</li>
 *   <li>Request logging for debugging</li>
 * </ul>
 * 
 * <p><strong>Thread Safety:</strong> This client is thread-safe and can be used
 * concurrently by multiple threads.
 * 
 * <p><strong>Error Handling:</strong> All HTTP errors are wrapped in
 * {@link ExternalApiException} with appropriate status codes.
 * 
 * @see ExternalApiException
 */
@Slf4j
@Component
public class SpoonacularClient {
    
    private static final String SERVICE_NAME = "Spoonacular API";
    private static final String SEARCH_ENDPOINT = "/recipes/complexSearch";
    private static final String RECIPE_INFO_ENDPOINT = "/recipes/{id}/information";
    
    private final RestClient restClient;
    
    public SpoonacularClient(RestClient spoonacularRestClient) {
        this.restClient = Objects.requireNonNull(spoonacularRestClient, 
                "RestClient cannot be null");
        log.info("SpoonacularClient initialized");
    }
    
    /**
     * Searches for recipes using the complexSearch endpoint.
     * 
     * <p>Uses {@code titleMatch} parameter to search by recipe title.
     * 
     * @param query search query (recipe title or keywords)
     * @param number number of results to return (page size)
     * @param offset starting position in result set (pagination offset)
     * @return search response with recipe results and pagination info
     * @throws ExternalApiException if API call fails
     * @throws IllegalArgumentException if query is null or blank, or if number/offset are negative
     */
    public SpoonacularSearchResponse searchRecipes(String query, int number, int offset) {
        validateSearchParams(query, number, offset);
        
        log.debug("Searching recipes: query='{}', number={}, offset={}", query, number, offset);
        
        try {
            SpoonacularSearchResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path(SEARCH_ENDPOINT)
                            .queryParam("titleMatch", query)
                            .queryParam("number", number)
                            .queryParam("offset", offset)
                            .build())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (_, clientResponse) -> {
                        throw mapHttpError(clientResponse.getStatusCode(), 
                                "Failed to search recipes");
                    })
                    .body(SpoonacularSearchResponse.class);
            
            if (response == null) {
                throw new ExternalApiException(
                        "Received null response from Spoonacular API",
                        0, SERVICE_NAME);
            }
            
            validateSearchResponse(response);
            
            log.info("Recipe search successful: query='{}', total={}, returned={}", 
                    query, response.getTotalResults(), response.getResults().size());
            
            return response;
            
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw mapHttpError(e.getStatusCode(), "Failed to search recipes", e);
        } catch (ResourceAccessException e) {
            throw new ExternalApiException(
                    "Network error while searching recipes: " + e.getMessage(),
                    0, SERVICE_NAME, e);
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during recipe search", e);
            throw new ExternalApiException(
                    "Unexpected error while searching recipes: " + e.getMessage(),
                    0, SERVICE_NAME, e);
        }
    }
    
    /**
     * Retrieves detailed information for a specific recipe.
     * 
     * <p>Includes nutrition information, ingredients, and instructions.
     * 
     * @param id recipe ID
     * @return detailed recipe information
     * @throws ExternalApiException if API call fails
     * @throws IllegalArgumentException if ID is null or invalid (≤ 0)
     */
    public RecipeDetail getRecipeInformation(Long id) {
        validateRecipeId(id);
        
        log.debug("Fetching recipe information: id={}", id);
        
        try {
            RecipeDetail recipe = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path(RECIPE_INFO_ENDPOINT)
                            .queryParam("includeNutrition", "true")
                            .build(id))
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (_, clientResponse) -> {
                        if (clientResponse.getStatusCode().value() == 404) {
                            throw new ExternalApiException(
                                    "Recipe with ID " + id + " not found",
                                    404, SERVICE_NAME);
                        }
                        throw mapHttpError(clientResponse.getStatusCode(), 
                                "Failed to fetch recipe information");
                    })
                    .body(RecipeDetail.class);
            
            if (recipe == null) {
                throw new ExternalApiException(
                        "Received null recipe from Spoonacular API",
                        0, SERVICE_NAME);
            }
            
            validateRecipeDetail(recipe, id);
            
            log.info("Recipe information retrieved successfully: id={}, title='{}'", 
                    id, recipe.getTitle());
            
            return recipe;
            
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            if (e.getStatusCode().value() == 404) {
                throw new ExternalApiException(
                        "Recipe with ID " + id + " not found",
                        404, SERVICE_NAME, e);
            }
            throw mapHttpError(e.getStatusCode(), "Failed to fetch recipe information", e);
        } catch (ResourceAccessException e) {
            throw new ExternalApiException(
                    "Network error while fetching recipe: " + e.getMessage(),
                    0, SERVICE_NAME, e);
        } catch (ExternalApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error fetching recipe {}", id, e);
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
     * Validates search response is not null and has required fields.
     */
    private void validateSearchResponse(SpoonacularSearchResponse response) {
        if (response == null) {
            throw new ExternalApiException(
                    "Received null response from Spoonacular API",
                    0, SERVICE_NAME);
        }
        if (response.getResults() == null) {
            log.warn("Search response has null results array, treating as empty");
            response.setResults(java.util.List.of());
        }
        if (response.getTotalResults() == null) {
            log.warn("Search response has null totalResults, defaulting to 0");
            response.setTotalResults(0);
        }
    }
    
    /**
     * Validates recipe detail response is not null and has required fields.
     */
    private void validateRecipeDetail(RecipeDetail recipe, Long expectedId) {
        if (recipe == null) {
            throw new ExternalApiException(
                    "Received null recipe from Spoonacular API",
                    0, SERVICE_NAME);
        }
        if (recipe.getId() == null) {
            throw new ExternalApiException(
                    "Recipe response missing ID field",
                    0, SERVICE_NAME);
        }
        if (!recipe.getId().equals(expectedId)) {
            log.warn("Recipe ID mismatch: expected={}, received={}", expectedId, recipe.getId());
        }
    }
    
    /**
     * Maps HTTP error status codes to ExternalApiException.
     * Centralizes error handling logic to avoid duplication.
     */
    private ExternalApiException mapHttpError(HttpStatusCode statusCode, String message) {
        return mapHttpError(statusCode, message, null);
    }
    
    /**
     * Maps HTTP error status codes to ExternalApiException with cause.
     * Centralizes error handling logic to avoid duplication.
     */
    private ExternalApiException mapHttpError(HttpStatusCode statusCode, String message, Throwable cause) {
        int status = statusCode.value();
        String errorMessage = String.format("%s (HTTP %d)", message, status);
        
        if (status == 429) {
            log.warn("Rate limit exceeded for {}", SERVICE_NAME);
            errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (status >= 500) {
            log.error("{} server error: {}", SERVICE_NAME, status);
            errorMessage = String.format("%s server error (HTTP %d)", SERVICE_NAME, status);
        } else if (status == 404) {
            log.debug("{} resource not found: {}", SERVICE_NAME, message);
            errorMessage = "Resource not found";
        }
        
        if (cause != null) {
            return new ExternalApiException(errorMessage, status, SERVICE_NAME, cause);
        }
        return new ExternalApiException(errorMessage, status, SERVICE_NAME);
    }
}

