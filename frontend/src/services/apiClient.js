/**
 * API Client for Luqma Backend.
 * 
 * Provides centralized functions to interact with the backend REST API.
 * All external API calls MUST go through the backend to protect API keys.
 * 
 * @module apiClient
 * 
 * Configuration:
 * - Base URL configured via VITE_API_URL environment variable
 * - Defaults to http://localhost:8080/api/v1 if not set
 * 
 * Security:
 * - Frontend NEVER calls external APIs directly
 * - All requests go through backend proxy
 * - API keys are protected on backend
 * 
 * ⚠️ IMPORTANT: Backend business logic endpoints are NOT yet implemented.
 * The backend currently only provides Spring Boot Actuator health check endpoints.
 * 
 * Planned endpoints (NOT YET AVAILABLE):
 * @function searchRecipes - POST /api/v1/recipes/search - 🚧 PLANNED
 * @function getRecipeDetails - GET /api/v1/recipes/{id} - 🚧 PLANNED
 * @function excludeIngredients - POST /api/v1/recipes/{id}/exclude-ingredients - 🚧 PLANNED
 * 
 * TODO: Implement API client functions when backend endpoints are ready
 */

// eslint-disable-next-line no-unused-vars
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

// Example structure for future implementation:
// 
// export async function searchRecipes(searchParams) {
//   const response = await fetch(`${API_BASE_URL}/recipes/search`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(searchParams)
//   })
//   if (!response.ok) {
//     throw new Error(`API error: ${response.status}`)
//   }
//   return response.json()
// }

export default {
  // Functions will be implemented here
}

