package app.luqma.backend.controller;

import app.luqma.backend.exception.InvalidPaginationException;
import app.luqma.backend.exception.ResourceNotFoundException;
import app.luqma.backend.model.dto.RecipeDetailResponse;
import app.luqma.backend.model.dto.RecipeSearchResponse;
import app.luqma.backend.model.dto.RecipeSummary;
import app.luqma.backend.service.RecipeDetailService;
import app.luqma.backend.service.RecipeSearchService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    
    @MockitoBean
    private RecipeDetailService recipeDetailService;
    
    @Test
    void searchRecipes_withValidParameters_returnsOk() throws Exception {
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
    
    // Recipe Detail Endpoint Tests
    
    @Test
    void getRecipeById_withValidId_returnsOk() throws Exception {
        // Given: A valid recipe ID
        Long recipeId = 715497L;
        RecipeDetailResponse mockRecipe = new RecipeDetailResponse(
                recipeId,
                "Chicken Pasta Alfredo",
                "https://example.com/image.jpg",
                35,
                4,
                List.of(),
                null,
                List.of()
        );
        
        when(recipeDetailService.getRecipeById(recipeId))
                .thenReturn(mockRecipe);
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/{id}", recipeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(recipeId.intValue())))
                .andExpect(jsonPath("$.title", is("Chicken Pasta Alfredo")));
        
        verify(recipeDetailService).getRecipeById(recipeId);
    }
    
    @Test
    void getRecipeById_withInvalidId_returnsNotFound() throws Exception {
        // Given: An invalid recipe ID
        Long invalidId = 999999L;
        
        when(recipeDetailService.getRecipeById(invalidId))
                .thenThrow(ResourceNotFoundException.forRecipe(invalidId));
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/{id}", invalidId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", containsString("not found")));
        
        verify(recipeDetailService).getRecipeById(invalidId);
    }
    
    @Test
    void getRecipeById_withNegativeId_returnsBadRequest() throws Exception {
        // Given: A negative recipe ID
        Long negativeId = -1L;
        
        // When / Then: Validation should reject before service call
        mockMvc.perform(get("/api/v1/recipes/{id}", negativeId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
    }
}

