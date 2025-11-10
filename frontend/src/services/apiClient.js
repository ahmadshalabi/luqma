/**
 * API Client for Luqma Backend.
 * 
 * Provides centralized functions to interact with the backend REST API.
 * All external API calls MUST go through the backend to protect API keys.
 * 
 * @module apiClient
 * 
 * Configuration:
 * - Base URL configured via LUQMA_API_URL environment variable
 * - Defaults to http://localhost:8080/api/v1 if not set
 * 
 * Security:
 * - Frontend NEVER calls external APIs directly
 * - All requests go through backend proxy
 * - API keys are protected on backend
 */

import { get, post } from '@/utils/httpClient'

const API_BASE_URL = import.meta.env.LUQMA_API_URL || 'http://localhost:8080/api/v1'

/**
 * Search for recipes with pagination support.
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query (required, 1-200 characters)
 * @param {number} [params.page=1] - Page number (1-indexed, 1-1000)
 * @param {number} [params.pageSize=9] - Number of results per page (1-100)
 * @returns {Promise<Object>} Search results with results array, page, pageSize, and totalResults
 * @throws {Error} If the API request fails or returns an error
 * 
 * @example
 * const results = await searchRecipes({ query: 'pasta', page: 1, pageSize: 9 })
 * // returns: { results: [...], page: 1, pageSize: 9, totalResults: 47 }
 */
export async function searchRecipes({ query, page = 1, pageSize = 9 }) {
  if (!query || query.trim().length === 0) {
    throw new Error('Search query is required')
  }

  const params = new URLSearchParams({
    query: query.trim(),
    page: String(page),
    pageSize: String(pageSize)
  })

  return get(`${API_BASE_URL}/recipes/search?${params}`)
}

/**
 * Fetch recipe details by ID.
 * 
 * @param {number|string} id - Recipe ID
 * @returns {Promise<Object>} Recipe details with ingredients, nutrition, and instructions
 * @throws {Error} If the API request fails or returns an error
 * 
 * @example
 * const recipe = await getRecipeById(715497)
 * // returns: { id: 715497, title: "Chicken Pasta Alfredo", ingredients: [...], ... }
 */
export async function getRecipeById(id) {
  const numId = Number(id)
  if (!numId || numId <= 0) {
    throw new Error('Invalid recipe ID')
  }

  return get(`${API_BASE_URL}/recipes/${numId}`)
}

/**
 * Exclude ingredients from a recipe and recalculate nutrition.
 * 
 * @param {number|string} recipeId - Recipe ID
 * @param {Array<number>} ingredientIds - Array of ingredient IDs to exclude
 * @returns {Promise<Object>} Updated recipe details with recalculated nutrition
 * @throws {Error} If the API request fails or returns an error
 * 
 * @example
 * const updatedRecipe = await excludeIngredients(715497, [20409, 5006])
 * // returns: { id: 715497, title: "...", ingredients: [...], nutrition: {...} }
 */
export async function excludeIngredients(recipeId, ingredientIds) {
  const numId = Number(recipeId)
  if (!numId || numId <= 0) {
    throw new Error('Invalid recipe ID')
  }

  if (!Array.isArray(ingredientIds) || ingredientIds.length === 0) {
    throw new Error('At least one ingredient ID must be provided')
  }

  return post(`${API_BASE_URL}/recipes/${numId}/exclude-ingredients`, { ingredientIds })
}

