/**
 * Data Transfer Objects (DTOs) for Spoonacular API responses.
 * 
 * <p>This package contains DTOs that map directly to Spoonacular API response structures.
 * These are internal models used only for deserializing API responses before mapping
 * to domain models.
 * 
 * <p><strong>Design Principles:</strong>
 * <ul>
 *   <li>All DTOs use {@code @JsonIgnoreProperties(ignoreUnknown = true)} to handle 
 *       future API changes without breaking deserialization</li>
 *   <li>Optional fields use {@code required = false} in {@code @JsonProperty} annotations</li>
 *   <li>Collections are initialized to empty lists to avoid null pointer exceptions</li>
 *   <li>Immutable where possible (using records for nested simple types)</li>
 * </ul>
 * 
 * <p><strong>Usage:</strong>
 * These DTOs are used exclusively by {@link app.luqma.backend.client.SpoonacularClient}
 * to deserialize API responses. The {@link app.luqma.backend.mapper.RecipeMapper}
 * converts these to domain models used throughout the application.
 * 
 * @see app.luqma.backend.client.SpoonacularClient
 * @see app.luqma.backend.model.domain
 */
package app.luqma.backend.model.dto.spoonacular;

