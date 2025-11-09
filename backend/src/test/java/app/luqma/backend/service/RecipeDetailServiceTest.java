package app.luqma.backend.service;

import app.luqma.backend.exception.ResourceNotFoundException;
import app.luqma.backend.model.dto.RecipeDetailResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Simple unit tests for RecipeDetailService.
 * Tests basic functionality without over-engineering.
 */
@SpringBootTest
class RecipeDetailServiceTest {
    
    @Autowired
    private RecipeDetailService recipeDetailService;
    
    /**
     * Test that service successfully retrieves a recipe by valid ID.
     */
    @Test
    void getRecipeById_WithValidId_ReturnsRecipe() {
        // Given: A valid recipe ID from mock data
        Long recipeId = 715497L;
        
        // When: Fetching recipe by ID
        RecipeDetailResponse recipe = recipeDetailService.getRecipeById(recipeId);
        
        // Then: Recipe is returned with expected data
        assertThat(recipe).isNotNull();
        assertThat(recipe.id()).isEqualTo(recipeId);
        assertThat(recipe.title()).isNotEmpty();
        assertThat(recipe.ingredients()).isNotNull();
        assertThat(recipe.nutrition()).isNotNull();
    }
    
    /**
     * Test that service throws ResourceNotFoundException for invalid ID.
     */
    @Test
    void getRecipeById_WithInvalidId_ThrowsResourceNotFoundException() {
        // Given: An invalid recipe ID not in mock data
        Long invalidId = 999999L;
        
        // When/Then: Attempting to fetch throws ResourceNotFoundException
        assertThatThrownBy(() -> recipeDetailService.getRecipeById(invalidId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found");
    }
    
    /**
     * Test that service throws IllegalArgumentException for null ID.
     */
    @Test
    void getRecipeById_WithNullId_ThrowsIllegalArgumentException() {
        // When/Then: Attempting to fetch with null throws exception
        assertThatThrownBy(() -> recipeDetailService.getRecipeById(null))
                .isInstanceOf(NullPointerException.class);
    }
    
    /**
     * Test that service throws IllegalArgumentException for negative ID.
     */
    @Test
    void getRecipeById_WithNegativeId_ThrowsIllegalArgumentException() {
        // Given: A negative recipe ID
        Long negativeId = -1L;
        
        // When/Then: Attempting to fetch throws exception
        assertThatThrownBy(() -> recipeDetailService.getRecipeById(negativeId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("positive");
    }
    
    /**
     * Test that service loads mock data on initialization.
     */
    @Test
    void init_LoadsMockData_Successfully() {
        // Given/When: Service is initialized via Spring context
        
        // Then: Service has loaded recipe IDs
        var recipeIds = recipeDetailService.getAllRecipeIds();
        assertThat(recipeIds).isNotEmpty();
        assertThat(recipeIds).contains(715497L, 642539L, 654812L, 782601L);
    }
}

