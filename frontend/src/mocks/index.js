/**
 * Mock Data Helper Module
 * 
 * Provides easy access to Spoonacular API mock data for development and testing.
 * This mock data matches the structure of the actual Spoonacular API responses.
 * 
 * Usage:
 * ```javascript
 * import { getRecipeSearchResults, getRecipeById } from '@/mocks'
 * 
 * // Get all search results
 * const searchResults = getRecipeSearchResults()
 * 
 * // Get specific recipe by ID
 * const recipe = getRecipeById(654812)
 * ```
 * 
 * @module mocks
 */

import recipeSearchResults from './recipe-search-results.json'
import recipe654812 from './recipe-654812.json'
import recipe715497 from './recipe-715497.json'
import recipe782601 from './recipe-782601.json'
import recipe642539 from './recipe-642539.json'

// Map of all recipes indexed by ID
const recipesById = {
  654812: recipe654812,
  715497: recipe715497,
  782601: recipe782601,
  642539: recipe642539
}

/**
 * Get mock recipe search results
 * Simulates response from POST /api/v1/recipes/search
 * 
 * @returns {Object} Search results with results array, offset, number, and totalResults
 */
export function getRecipeSearchResults() {
  return recipeSearchResults
}

/**
 * Get a specific recipe by ID
 * Simulates response from GET /api/v1/recipes/{id}
 * 
 * @param {number} recipeId - The recipe ID to find
 * @returns {Object|null} Recipe details object or null if not found
 */
export function getRecipeById(recipeId) {
  return recipesById[recipeId] || null
}

// Default export with all functions
export default {
  getRecipeSearchResults,
  getRecipeById
}

