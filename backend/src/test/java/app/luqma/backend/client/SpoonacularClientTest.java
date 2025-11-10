package app.luqma.backend.client;

import app.luqma.backend.exception.ExternalApiException;
import app.luqma.backend.model.domain.RecipeDetail;
import app.luqma.backend.model.dto.spoonacular.SpoonacularSearchResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SpoonacularClient.
 * Tests API calls, error handling, and edge cases.
 */
@ExtendWith(MockitoExtension.class)
@SuppressWarnings({"unchecked", "rawtypes", "null"})
class SpoonacularClientTest {
    
    @Mock
    private RestClient restClient;
    
    @Mock
    private RestClient.RequestHeadersUriSpec requestHeadersUriSpec;
    
    @Mock
    private RestClient.RequestHeadersSpec requestHeadersSpec;
    
    @Mock
    private RestClient.ResponseSpec responseSpec;
    
    private SpoonacularClient client;
    
    @BeforeEach
    void setUp() {
        client = new SpoonacularClient(restClient);
    }
    
    
    @Test
    void constructor_WithNullRestClient_ThrowsNullPointerException() {
        assertThrows(NullPointerException.class, () -> new SpoonacularClient(null));
    }
    
    
    @Test
    void searchRecipes_WithValidParams_ReturnsSearchResponse() {
        String query = "pasta";
        int number = 10;
        int offset = 0;
        
        var mockRecipe = new SpoonacularSearchResponse.SpoonacularRecipeSummary();
        mockRecipe.setId(123L);
        mockRecipe.setTitle("Pasta Recipe");
        mockRecipe.setImage("image.jpg");
        
        var mockResponse = new SpoonacularSearchResponse();
        mockResponse.setResults(List.of(mockRecipe));
        mockResponse.setTotalResults(1);
        mockResponse.setNumber(10);
        mockResponse.setOffset(0);
        
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(SpoonacularSearchResponse.class)).thenReturn(mockResponse);
        
        SpoonacularSearchResponse result = client.searchRecipes(query, number, offset);
        
        assertNotNull(result);
        assertEquals(1, result.getTotalResults());
        assertEquals(1, result.getResults().size());
        assertEquals("Pasta Recipe", result.getResults().get(0).getTitle());
    }
    
    @Test
    void searchRecipes_WithNullQuery_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
                () -> client.searchRecipes(null, 10, 0));
    }
    
    @Test
    void searchRecipes_WithBlankQuery_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
                () -> client.searchRecipes("   ", 10, 0));
    }
    
    @Test
    void searchRecipes_WithNegativeNumber_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
                () -> client.searchRecipes("pasta", -1, 0));
    }
    
    @Test
    void searchRecipes_WithNegativeOffset_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
                () -> client.searchRecipes("pasta", 10, -1));
    }
    
    @Test
    void searchRecipes_WithNullResponse_ThrowsExternalApiException() {
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(SpoonacularSearchResponse.class)).thenReturn(null);
        
        ExternalApiException exception = assertThrows(ExternalApiException.class, 
                () -> client.searchRecipes("pasta", 10, 0));
        assertEquals(0, exception.getStatusCode());
        assertTrue(exception.getMessage().contains("null response"));
    }
    
    @Test
    void searchRecipes_WithEmptyResults_ReturnsEmptyList() {
        var mockResponse = new SpoonacularSearchResponse();
        mockResponse.setResults(List.of());
        mockResponse.setTotalResults(0);
        
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(SpoonacularSearchResponse.class)).thenReturn(mockResponse);
        
        SpoonacularSearchResponse result = client.searchRecipes("nonexistent", 10, 0);
        
        assertNotNull(result);
        assertEquals(0, result.getTotalResults());
        assertTrue(result.getResults().isEmpty());
    }
    
    @Test
    void searchRecipes_WithRateLimitError_ThrowsExternalApiException() {
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(SpoonacularSearchResponse.class))
                .thenThrow(new HttpClientErrorException(HttpStatus.TOO_MANY_REQUESTS));
        
        ExternalApiException exception = assertThrows(ExternalApiException.class, 
                () -> client.searchRecipes("pasta", 10, 0));
        assertEquals(429, exception.getStatusCode());
        assertTrue(exception.isRateLimitError());
    }
    
    @Test
    void searchRecipes_WithNetworkError_ThrowsExternalApiException() {
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(SpoonacularSearchResponse.class))
                .thenThrow(new ResourceAccessException("Connection timeout"));
        
        ExternalApiException exception = assertThrows(ExternalApiException.class, 
                () -> client.searchRecipes("pasta", 10, 0));
        assertEquals(0, exception.getStatusCode());
        assertTrue(exception.isNetworkError());
    }
    
    @Test
    void searchRecipes_WithServerError_ThrowsExternalApiException() {
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(SpoonacularSearchResponse.class))
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
        
        ExternalApiException exception = assertThrows(ExternalApiException.class, 
                () -> client.searchRecipes("pasta", 10, 0));
        assertEquals(500, exception.getStatusCode());
        assertTrue(exception.isServerError());
    }
    
    
    @Test
    void getRecipeInformation_WithValidId_ReturnsRecipeDetail() {
        Long recipeId = 123L;
        var mockRecipe = RecipeDetail.builder()
                .id(recipeId)
                .title("Test Recipe")
                .image("image.jpg")
                .servings(4)
                .build();
        
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(RecipeDetail.class)).thenReturn(mockRecipe);
        
        RecipeDetail result = client.getRecipeInformation(recipeId);
        
        assertNotNull(result);
        assertEquals(recipeId, result.getId());
        assertEquals("Test Recipe", result.getTitle());
    }
    
    @Test
    void getRecipeInformation_WithNullId_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
                () -> client.getRecipeInformation(null));
    }
    
    @Test
    void getRecipeInformation_WithZeroId_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
                () -> client.getRecipeInformation(0L));
    }
    
    @Test
    void getRecipeInformation_WithNegativeId_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, 
                () -> client.getRecipeInformation(-1L));
    }
    
    @Test
    void getRecipeInformation_WithNotFoundError_ThrowsExternalApiException() {
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(RecipeDetail.class))
                .thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));
        
        ExternalApiException exception = assertThrows(ExternalApiException.class, 
                () -> client.getRecipeInformation(999L));
        assertEquals(404, exception.getStatusCode());
    }
    
    @Test
    void getRecipeInformation_WithNullResponse_ThrowsExternalApiException() {
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(RecipeDetail.class)).thenReturn(null);
        
        ExternalApiException exception = assertThrows(ExternalApiException.class, 
                () -> client.getRecipeInformation(123L));
        assertEquals(0, exception.getStatusCode());
        assertTrue(exception.getMessage().contains("null recipe"));
    }
    
    @Test
    void getRecipeInformation_WithMissingIdInResponse_ThrowsExternalApiException() {
        var mockRecipe = RecipeDetail.builder()
                .title("Test Recipe")
                .build(); // Missing ID
        
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(any(java.util.function.Function.class)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.onStatus(any(), any())).thenReturn(responseSpec);
        when(responseSpec.body(RecipeDetail.class)).thenReturn(mockRecipe);
        
        ExternalApiException exception = assertThrows(ExternalApiException.class, 
                () -> client.getRecipeInformation(123L));
        assertTrue(exception.getMessage().contains("missing ID"));
    }
}

