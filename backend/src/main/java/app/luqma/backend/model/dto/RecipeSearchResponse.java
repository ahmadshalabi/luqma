package app.luqma.backend.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * Response DTO for recipe search operations.
 *
 * @param results List of recipes matching the search criteria
 * @param page Current page number (1-indexed)
 * @param pageSize Number of items per page
 * @param totalResults Total number of results available
 */
@Schema(description = "Paginated recipe search results")
public record RecipeSearchResponse(
    @Schema(description = "List of recipes matching the search criteria")
    List<RecipeSummary> results,
    
    @Schema(description = "Current page number (1-indexed)", example = "1")
    int page,
    
    @Schema(description = "Number of items per page", example = "9")
    int pageSize,
    
    @Schema(description = "Total number of results available", example = "47")
    int totalResults
) {}
