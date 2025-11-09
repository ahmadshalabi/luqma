package app.luqma.backend.service;

import app.luqma.backend.config.RecipeSearchProperties;
import app.luqma.backend.model.dto.RecipeSearchResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for RecipeSearchService.
 * Tests search functionality, pagination, validation, and edge cases.
 */
@ExtendWith(MockitoExtension.class)
class RecipeSearchServiceTest {
    
    private RecipeSearchService recipeSearchService;
    
    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        RecipeSearchProperties properties = new RecipeSearchProperties();
        properties.setMaxPageSize(100);
        properties.setDefaultPageSize(9);
        properties.setMaxPageNumber(1000);
        recipeSearchService = new RecipeSearchService(objectMapper, properties);
        recipeSearchService.init();
    }
    
    @Test
    void searchRecipes_withValidQuery_returnsMatchingResults() {
        // Given
        String query = "pasta";
        int page = 1;
        int pageSize = 9;
        
        // When
        RecipeSearchResponse response = recipeSearchService.searchRecipes(query, page, pageSize);
        
        // Then
        assertThat(response).isNotNull();
        assertThat(response.results()).isNotEmpty();
        assertThat(response.results()).allMatch(recipe -> 
            recipe.title().toLowerCase().contains("pasta")
        );
        assertThat(response.page()).isEqualTo(1);
        assertThat(response.pageSize()).isLessThanOrEqualTo(pageSize);
    }
    
    @Test
    void searchRecipes_withNoMatches_returnsEmptyResults() {
        // Given
        String query = "nonexistentrecipexyz";
        
        // When
        RecipeSearchResponse response = recipeSearchService.searchRecipes(query, 1, 9);
        
        // Then
        assertThat(response).isNotNull();
        assertThat(response.results()).isEmpty();
        assertThat(response.totalResults()).isEqualTo(0);
    }
    
    @Test
    void searchRecipes_withPageBeyondResults_returnsEmptyResults() {
        // When
        RecipeSearchResponse response = recipeSearchService.searchRecipes("pasta", 999, 9);
        
        // Then
        assertThat(response).isNotNull();
        assertThat(response.results()).isEmpty();
        assertThat(response.page()).isEqualTo(999);
    }
    
    @Test
    void searchRecipes_withCaseInsensitiveQuery_returnsResults() {
        // When
        RecipeSearchResponse response = recipeSearchService.searchRecipes("PASTA", 1, 9);
        
        // Then
        assertThat(response.results()).isNotEmpty();
        assertThat(response.results()).allMatch(recipe -> 
            recipe.title().toLowerCase().contains("pasta")
        );
    }
}

