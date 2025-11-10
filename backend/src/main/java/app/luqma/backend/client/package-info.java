/**
 * External API client implementations.
 * 
 * <p>This package contains HTTP clients for interacting with external services.
 * All external API calls (e.g., Spoonacular API) MUST be made through clients
 * in this package to protect API keys and provide consistent error handling.
 * 
 * <p><strong>Security Note:</strong> API keys must never be exposed to the frontend.
 * All external API communication happens server-side through these clients.
 * 
 * <p><strong>Current Status:</strong> Spoonacular API client fully implemented.
 * The application uses {@link SpoonacularClient} for all recipe data from the Spoonacular API.
 * Mock data in {@code resources/mocks/} is retained for testing purposes.
 * 
 * @see app.luqma.backend.client.SpoonacularClient
 * @see app.luqma.backend.service.RecipeSearchService
 */
package app.luqma.backend.client;

