package app.luqma.backend;

import app.luqma.backend.config.RecipeSearchProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Main application class for Luqma Backend.
 * 
 * Spring Boot application providing REST API endpoints for recipe search
 * with nutritional information and ingredient exclusion features.
 * Acts as a secure proxy to the Spoonacular API, protecting API keys
 * and implementing business logic.
 */
@SpringBootApplication
@EnableConfigurationProperties(RecipeSearchProperties.class)
public class LuqmaBackendApplication {

  /**
   * Application entry point.
   * 
   * @param args command line arguments
   */
  static void main(String[] args) {
    SpringApplication.run(LuqmaBackendApplication.class, args);
  }

}
