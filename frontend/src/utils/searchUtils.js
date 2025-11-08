/**
 * Search utility functions for filtering recipes.
 * 
 * @module searchUtils
 */

/**
 * Filters recipes based on a search query.
 * Matches against recipe title (case-insensitive).
 * 
 * @param {Array} recipes - Array of recipe objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered array of recipes
 * 
 * @example
 * const recipes = [
 *   { id: 1, title: 'Pasta Carbonara' },
 *   { id: 2, title: 'Chicken Alfredo' }
 * ]
 * filterRecipes(recipes, 'pasta') // Returns [{ id: 1, title: 'Pasta Carbonara' }]
 */
export function filterRecipes(recipes, query) {
  // Handle invalid inputs
  if (!Array.isArray(recipes)) {
    return []
  }

  // Return empty array if query is empty or whitespace
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return []
  }

  const normalizedQuery = query.toLowerCase().trim()

  return recipes.filter((recipe) => {
    // Ensure recipe has a title
    if (!recipe || typeof recipe.title !== 'string') {
      return false
    }

    return recipe.title.toLowerCase().includes(normalizedQuery)
  })
}

