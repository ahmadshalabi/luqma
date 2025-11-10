package app.luqma.backend.integration;

import app.luqma.backend.client.SpoonacularClient;
import app.luqma.backend.model.dto.spoonacular.SpoonacularSearchResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.containsStringIgnoringCase;
import static org.hamcrest.Matchers.everyItem;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "rate-limit.max-requests-per-minute=1000")
class RecipeSearchIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private SpoonacularClient spoonacularClient;
    
    @BeforeEach
    void setUp() {
        when(spoonacularClient.searchRecipes(anyString(), anyInt(), anyInt()))
                .thenReturn(emptyResponse());
    }
    
    @Test
    void searchRecipes_withPastaQuery_returnsMatchingRecipes() throws Exception {
        when(spoonacularClient.searchRecipes(eq("pasta"), anyInt(), anyInt()))
                .thenReturn(createResponse("Pasta Carbonara", 123L));
        
        mockMvc.perform(get("/api/v1/recipes/search").param("query", "pasta"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.results[*].title").value(everyItem(containsStringIgnoringCase("pasta"))))
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.pageSize").value(9));
    }
    
    @Test
    void searchRecipes_withPagination_returnsCorrectPage() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "test")
                        .param("page", "2")
                        .param("pageSize", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(2))
                .andExpect(jsonPath("$.pageSize").value(3));
    }
    
    @Test
    void searchRecipes_withoutQuery_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
    
    @Test
    void searchRecipes_withInvalidPage_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta")
                        .param("page", "0"))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    void searchRecipes_withNonMatchingQuery_returnsEmptyResults() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search").param("query", "xyznonexistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isEmpty())
                .andExpect(jsonPath("$.totalResults").value(0));
    }
    
    @Test
    void searchRecipes_withSpecialCharacters_handlesSafely() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search").param("query", "<script>alert('xss')</script>"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isArray());
    }
    
    @Test
    void healthEndpoint_returnsOk() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
    
    private SpoonacularSearchResponse emptyResponse() {
        var response = new SpoonacularSearchResponse();
        response.setResults(List.of());
        response.setTotalResults(0);
        return response;
    }
    
    private SpoonacularSearchResponse createResponse(String title, Long id) {
        var recipe = new SpoonacularSearchResponse.SpoonacularRecipeSummary();
        recipe.setId(id);
        recipe.setTitle(title);
        recipe.setImage("image.jpg");
        
        var response = new SpoonacularSearchResponse();
        response.setResults(List.of(recipe));
        response.setTotalResults(1);
        return response;
    }
}
