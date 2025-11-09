package app.luqma.backend.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

/**
 * Configuration properties for recipe search operations.
 * Binds to recipe-search.* properties in application.yaml.
 */
@Data
@Component
@Validated
@ConfigurationProperties(prefix = "recipe-search")
public class RecipeSearchProperties {
  
  /**
   * Default page size for search results.
   */
  @Min(value = 1, message = "Default page size must be at least 1")
  @Max(value = 100, message = "Default page size must not exceed 100")
  private int defaultPageSize = 9;
  
  /**
   * Maximum allowed page size for search results.
   */
  @Min(value = 1, message = "Max page size must be at least 1")
  @Max(value = 100, message = "Max page size must not exceed 100")
  private int maxPageSize = 100;
  
  /**
   * Maximum allowed page number for pagination.
   */
  @Min(value = 1, message = "Max page number must be at least 1")
  private int maxPageNumber = 1000;
}

