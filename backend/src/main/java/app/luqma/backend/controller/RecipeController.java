package app.luqma.backend.controller;

import app.luqma.backend.model.dto.RecipeDetailResponse;
import app.luqma.backend.model.dto.RecipeSearchResponse;
import app.luqma.backend.service.RecipeDetailService;
import app.luqma.backend.service.RecipeSearchService;
import app.luqma.backend.util.StringSanitizer;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for recipe-related operations.
 * Provides endpoints for searching recipes with pagination and retrieving recipe details.
 */
@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/recipes")
@Tag(name = "Recipe API", description = "Endpoints for recipe search and retrieval")
public class RecipeController {
    
    private final RecipeSearchService recipeSearchService;
    private final RecipeDetailService recipeDetailService;
    
    public RecipeController(RecipeSearchService recipeSearchService, RecipeDetailService recipeDetailService) {
        this.recipeSearchService = recipeSearchService;
        this.recipeDetailService = recipeDetailService;
    }
    
    /**
     * Searches for recipes based on query with pagination support.
     * 
     * @param query the search query (required, 1-200 characters)
     * @param page the page number (1-indexed, default: 1)
     * @param pageSize the number of results per page (default: 9, max: 100)
     * @return paginated search results
     */
    @GetMapping("/search")
    @Operation(
        summary = "Search for recipes",
        description = "Search for recipes by title with pagination support. Query parameter is required. " +
                     "Returns recipes that match the search term (case-insensitive substring match)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Search completed successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = RecipeSearchResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request parameters (missing query, invalid pagination values)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = app.luqma.backend.exception.ErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "429",
            description = "Too many requests - rate limit exceeded",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = app.luqma.backend.exception.ErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = app.luqma.backend.exception.ErrorResponse.class)
            )
        )
    })
    public ResponseEntity<RecipeSearchResponse> searchRecipes(
            @Parameter(
                description = "Search query to filter recipes by title (required, 1-200 characters)",
                required = true,
                example = "pasta"
            )
            @RequestParam
            @NotBlank(message = "Search query is required. Please provide a search term.")
            @Size(min = 1, max = 200, message = "Search query must be between 1 and 200 characters")
            String query,
            
            @Parameter(
                description = "Page number (1-indexed, 1-1000)",
                example = "1"
            )
            @RequestParam(defaultValue = "1")
            @Min(value = 1, message = "Page number must be 1 or greater")
            @Max(value = 1000, message = "Page number must not exceed 1000")
            int page,
            
            @Parameter(
                description = "Number of results per page (1-100)",
                example = "9"
            )
            @RequestParam(defaultValue = "9")
            @Min(value = 1, message = "Page size must be at least 1")
            @Max(value = 100, message = "Page size must not exceed 100")
            int pageSize
    ) {
        String trimmedQuery = query.trim();
        
        log.info("Received search request: query='{}', page={}, pageSize={}", 
                StringSanitizer.sanitizeForLogging(trimmedQuery, 100), page, pageSize);
        
        RecipeSearchResponse response = recipeSearchService.searchRecipes(trimmedQuery, page, pageSize);
        
        log.debug("Search request completed successfully: page {} with {} results of {} total", 
                response.page(), response.results().size(), response.totalResults());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Retrieves detailed information for a specific recipe by ID.
     * 
     * @param id the recipe ID (must be positive)
     * @return detailed recipe information
     */
    @GetMapping("/{id}")
    @Operation(
        summary = "Get recipe details by ID",
        description = "Retrieves complete recipe information including ingredients, nutrition, and cooking instructions. " +
                     "Returns 404 if the recipe is not found."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Recipe found successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = RecipeDetailResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid recipe ID (must be positive integer)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = app.luqma.backend.exception.ErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Recipe not found with the specified ID",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = app.luqma.backend.exception.ErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = app.luqma.backend.exception.ErrorResponse.class)
            )
        )
    })
    public ResponseEntity<RecipeDetailResponse> getRecipeById(
            @Parameter(
                description = "Recipe ID (must be a positive integer)",
                required = true,
                example = "715497"
            )
            @PathVariable
            @Min(value = 1, message = "Recipe ID must be a positive integer")
            Long id
    ) {
        log.info("Received request for recipe details: id={}", id);
        
        RecipeDetailResponse response = recipeDetailService.getRecipeById(id);
        
        log.debug("Recipe details retrieved successfully for ID: {}", id);
        
        return ResponseEntity.ok(response);
    }
}

