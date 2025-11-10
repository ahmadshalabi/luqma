package app.luqma.backend.exception;

import app.luqma.backend.controller.RecipeController;
import app.luqma.backend.service.RecipeDetailService;
import app.luqma.backend.service.RecipeSearchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Unit tests for GlobalExceptionHandler.
 */
@WebMvcTest(RecipeController.class)
@org.springframework.context.annotation.Import({
    app.luqma.backend.config.SecurityConfig.class,
    app.luqma.backend.config.CorsProperties.class
})
class GlobalExceptionHandlerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockitoBean
    private RecipeSearchService recipeSearchService;
    
    @MockitoBean
    private RecipeDetailService recipeDetailService;
    
    @Test
    void handleInvalidPaginationException_returns400() throws Exception {
        when(recipeSearchService.searchRecipes(anyString(), anyInt(), anyInt()))
                .thenThrow(new InvalidPaginationException("Invalid page"));
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
    }
    
    @Test
    void handleResourceLoadException_returns500() throws Exception {
        when(recipeSearchService.searchRecipes(anyString(), anyInt(), anyInt()))
                .thenThrow(new ResourceLoadException("Failed to load data"));
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status", is(500)));
    }
    
    @Test
    void handleGenericException_returns500() throws Exception {
        when(recipeSearchService.searchRecipes(anyString(), anyInt(), anyInt()))
                .thenThrow(new RuntimeException("Error"));
        
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status", is(500)));
    }
    
    @Test
    void handleMissingParameter_returns400() throws Exception {
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")))
                .andExpect(jsonPath("$.message", containsString("query")));
    }
    
    @Test
    void handleTypeMismatch_returns400() throws Exception {
        // When / Then
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta")
                        .param("page", "invalid")
                        .param("pageSize", "10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }
}

