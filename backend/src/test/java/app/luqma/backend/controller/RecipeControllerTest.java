package app.luqma.backend.controller;

import app.luqma.backend.exception.InvalidPaginationException;
import app.luqma.backend.model.dto.RecipeSearchResponse;
import app.luqma.backend.model.dto.RecipeSummary;
import app.luqma.backend.service.RecipeSearchService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for RecipeController.
 */
@WebMvcTest(RecipeController.class)
@org.springframework.context.annotation.Import({
    app.luqma.backend.config.SecurityConfig.class,
    app.luqma.backend.config.CorsProperties.class
})
class RecipeControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockitoBean
    private RecipeSearchService recipeSearchService;
    
    @Test
    void searchRecipes_withValidParameters_returnsOk() throws Exception {
        // Given
        RecipeSearchResponse mockResponse = new RecipeSearchResponse(
                List.of(new RecipeSummary(
                        1L,
                        "Pasta Carbonara",
                        "http://example.com/image.jpg"
                )),
                1,
                9,
                1
        );
        
        when(recipeSearchService.searchRecipes(anyString(), anyInt(), anyInt()))
                .thenReturn(mockResponse);
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results", hasSize(1)))
                .andExpect(jsonPath("$.page", is(1)))
                .andExpect(jsonPath("$.pageSize", is(9)))
                .andExpect(jsonPath("$.totalResults", is(1)));
        
        verify(recipeSearchService).searchRecipes("pasta", 1, 9);
    }
    
    @Test
    void searchRecipes_withMissingQuery_returnsBadRequest() throws Exception {
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.message", containsString("query")));
        
        verify(recipeSearchService, never()).searchRecipes(anyString(), anyInt(), anyInt());
    }
    
    @Test
    void searchRecipes_withBlankQuery_returnsBadRequest() throws Exception {
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "   ")
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("query")));
        
        verify(recipeSearchService, never()).searchRecipes(anyString(), anyInt(), anyInt());
    }
    
    @Test
    void searchRecipes_withInvalidPage_returnsBadRequest() throws Exception {
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta")
                        .param("page", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", containsString("Page number must be 1 or greater")));
        
        verify(recipeSearchService, never()).searchRecipes(anyString(), anyInt(), anyInt());
    }
    
    @Test
    void searchRecipes_withInvalidPageSize_returnsBadRequest() throws Exception {
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta")
                        .param("pageSize", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
        
        verify(recipeSearchService, never()).searchRecipes(anyString(), anyInt(), anyInt());
    }
    
    @Test
    void searchRecipes_withDefaultPagination_usesDefaults() throws Exception {
        // Given
        RecipeSearchResponse mockResponse = new RecipeSearchResponse(
                List.of(),
                1,
                9,
                0
        );
        
        when(recipeSearchService.searchRecipes(anyString(), eq(1), eq(9)))
                .thenReturn(mockResponse);
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta"))
                .andExpect(status().isOk());
        
        verify(recipeSearchService).searchRecipes("pasta", 1, 9);
    }
    
    @Test
    void searchRecipes_whenServiceThrowsInvalidPaginationException_returnsBadRequest() throws Exception {
        // Given
        when(recipeSearchService.searchRecipes(anyString(), anyInt(), anyInt()))
                .thenThrow(new InvalidPaginationException("Invalid pagination"));
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
    }
    
    @Test
    void searchRecipes_whenServiceThrowsException_returnsInternalServerError() throws Exception {
        // Given
        when(recipeSearchService.searchRecipes(anyString(), anyInt(), anyInt()))
                .thenThrow(new RuntimeException("Unexpected error"));
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status", is(500)));
    }
    
    @Test
    void searchRecipes_trimsWhitespaceFromQuery() throws Exception {
        // Given
        RecipeSearchResponse mockResponse = new RecipeSearchResponse(
                List.of(),
                1,
                9,
                0
        );
        
        when(recipeSearchService.searchRecipes(eq("pasta"), anyInt(), anyInt()))
                .thenReturn(mockResponse);
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "  pasta  "))
                .andExpect(status().isOk());
        
        verify(recipeSearchService).searchRecipes("pasta", 1, 9);
    }
}

