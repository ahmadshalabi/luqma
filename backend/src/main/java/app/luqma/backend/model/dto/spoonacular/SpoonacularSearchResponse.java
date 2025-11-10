package app.luqma.backend.model.dto.spoonacular;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO for Spoonacular complexSearch API response.
 * Maps the response from GET /recipes/complexSearch endpoint.
 * 
 * <p>Uses {@code @JsonIgnoreProperties(ignoreUnknown = true)} to handle
 * future API changes gracefully without breaking deserialization.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SpoonacularSearchResponse {
    
    /**
     * Array of recipe search results.
     */
    @Builder.Default
    private List<SpoonacularRecipeSummary> results = new ArrayList<>();
    
    /**
     * Starting position in the result set (pagination offset).
     */
    private Integer offset;
    
    /**
     * Number of results returned in this response.
     */
    private Integer number;
    
    /**
     * Total number of recipes matching the search criteria.
     */
    @JsonProperty("totalResults")
    private Integer totalResults;
    
    /**
     * Individual recipe summary in search results.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SpoonacularRecipeSummary {
        
        /**
         * Unique recipe ID.
         */
        private Long id;
        
        /**
         * Recipe title/name.
         */
        private String title;
        
        /**
         * URL to recipe image.
         */
        private String image;
        
        /**
         * Image file type (jpg, png, etc.).
         */
        @JsonProperty("imageType")
        private String imageType;
    }
}

