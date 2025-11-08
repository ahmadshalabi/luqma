package app.luqma.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for Luqma Backend.
 * 
 * Spring Boot application providing REST API endpoints for recipe search
 * with nutritional information and ingredient exclusion features.
 * Acts as a secure proxy to the Spoonacular API, protecting API keys
 * and implementing business logic.
 */
@SpringBootApplication
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
