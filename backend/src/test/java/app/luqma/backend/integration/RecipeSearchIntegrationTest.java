package app.luqma.backend.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsStringIgnoringCase;
import static org.hamcrest.Matchers.everyItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for recipe search API endpoints.
 * Tests the entire application stack from HTTP request to response.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "rate-limit.max-requests-per-minute=1000"
})
class RecipeSearchIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void searchRecipes_withPastaQuery_returnsMatchingRecipes() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.results").isArray())
                .andExpect(jsonPath("$.results[*].title").value(everyItem(containsStringIgnoringCase("pasta"))))
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.pageSize").value(9))
                .andExpect(jsonPath("$.totalResults").isNumber());
    }
    
    @Test
    void searchRecipes_withPagination_returnsCorrectPage() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "a")
                        .param("page", "2")
                        .param("pageSize", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(2))
                .andExpect(jsonPath("$.pageSize").value(3))
                .andExpect(jsonPath("$.results").isArray());
    }
    
    @Test
    void searchRecipes_withoutQuery_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.timestamp").exists());
    }
    
    @Test
    void searchRecipes_withInvalidPage_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "pasta")
                        .param("page", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
    
    @Test
    void searchRecipes_withNonMatchingQuery_returnsEmptyResults() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "xyznonexistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isEmpty())
                .andExpect(jsonPath("$.totalResults").value(0));
    }
    
    @Test
    void searchRecipes_withSpecialCharacters_handlesSafely() throws Exception {
        mockMvc.perform(get("/api/v1/recipes/search")
                        .param("query", "<script>alert('xss')</script>"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isArray());
    }
    
    @Test
    void healthEndpoint_returnsOk() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}

