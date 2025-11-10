package app.luqma.backend.service;

import app.luqma.backend.client.SpoonacularClient;
import app.luqma.backend.config.RecipeSearchProperties;
import app.luqma.backend.model.dto.RecipeSearchResponse;
import app.luqma.backend.model.dto.spoonacular.SpoonacularSearchResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

/**
 * Unit tests for RecipeSearchService.
 * Tests search functionality, pagination, validation, and edge cases.
 */
@ExtendWith(MockitoExtension.class)
class RecipeSearchServiceTest {
    
    @Mock
    private SpoonacularClient spoonacularClient;
    
    private RecipeSearchService recipeSearchService;
    private RecipeSearchProperties properties;
    
    @BeforeEach
    void setUp() {
        properties = new RecipeSearchProperties();
        properties.setMaxPageSize(100);
        properties.setDefaultPageSize(9);
        properties.setMaxPageNumber(1000);
        recipeSearchService = new RecipeSearchService(spoonacularClient, properties);
    }
    
    @Test
    void searchRecipes_withValidQuery_returnsMatchingResults() {
        String query = "pasta";
        int page = 1;
        int pageSize = 9;
        
        var mockRecipe = new SpoonacularSearchResponse.SpoonacularRecipeSummary();
        mockRecipe.setId(123L);
        mockRecipe.setTitle("Pasta Carbonara");
        mockRecipe.setImage("image.jpg");
        
        var mockResponse = new SpoonacularSearchResponse();
        mockResponse.setResults(List.of(mockRecipe));
        mockResponse.setTotalResults(1);
        
        when(spoonacularClient.searchRecipes(eq(query), eq(pageSize), eq(0)))
                .thenReturn(mockResponse);
        
        RecipeSearchResponse response = recipeSearchService.searchRecipes(query, page, pageSize);
        
        assertThat(response).isNotNull();
        assertThat(response.results()).isNotEmpty();
        assertThat(response.results()).hasSize(1);
        assertThat(response.results().get(0).title()).contains("Pasta");
        assertThat(response.page()).isEqualTo(1);
        assertThat(response.pageSize()).isEqualTo(pageSize);
    }
    
    @Test
    void searchRecipes_withNoMatches_returnsEmptyResults() {
        String query = "nonexistentrecipexyz";
        
        var mockResponse = new SpoonacularSearchResponse();
        mockResponse.setResults(List.of());
        mockResponse.setTotalResults(0);
        
        when(spoonacularClient.searchRecipes(eq(query), anyInt(), anyInt()))
                .thenReturn(mockResponse);
        
        RecipeSearchResponse response = recipeSearchService.searchRecipes(query, 1, 9);
        
        assertThat(response).isNotNull();
        assertThat(response.results()).isEmpty();
        assertThat(response.totalResults()).isEqualTo(0);
    }
    
    @Test
    void searchRecipes_withPageSizeExceedingMax_capsPageSize() {
        int requestedPageSize = 150;
        int maxPageSize = properties.getMaxPageSize();
        
        var mockResponse = new SpoonacularSearchResponse();
        mockResponse.setResults(List.of());
        mockResponse.setTotalResults(0);
        
        when(spoonacularClient.searchRecipes(anyString(), eq(maxPageSize), anyInt()))
                .thenReturn(mockResponse);
        
        RecipeSearchResponse response = recipeSearchService.searchRecipes("pasta", 1, requestedPageSize);
        
        assertThat(response.pageSize()).isEqualTo(maxPageSize);
    }
    
    @Test
    void searchRecipes_withBlankQuery_returnsEmptyResults() {
        RecipeSearchResponse response = recipeSearchService.searchRecipes("   ", 1, 9);
        
        assertThat(response).isNotNull();
        assertThat(response.results()).isEmpty();
        assertThat(response.totalResults()).isEqualTo(0);
    }
    
    @Test
    void searchRecipes_withSecondPage_calculatesCorrectOffset() {
        int page = 2;
        int pageSize = 9;
        int expectedOffset = (page - 1) * pageSize;
        
        var mockResponse = new SpoonacularSearchResponse();
        mockResponse.setResults(List.of());
        mockResponse.setTotalResults(0);
        
        when(spoonacularClient.searchRecipes(anyString(), eq(pageSize), eq(expectedOffset)))
                .thenReturn(mockResponse);
        
        RecipeSearchResponse response = recipeSearchService.searchRecipes("pasta", page, pageSize);
        
        assertThat(response.page()).isEqualTo(page);
    }
}
