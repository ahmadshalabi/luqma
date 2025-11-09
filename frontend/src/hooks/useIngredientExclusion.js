import { useState, useCallback } from 'react'
import { excludeIngredients } from '@/services/apiClient'

/**
 * Custom hook for managing ingredient exclusion state and operations.
 * Handles exclusion selection, API calls, and loading/error states.
 * 
 * @param {string|number} recipeId - Recipe ID for exclusion operations
 * @returns {Object} Hook state and methods
 * @returns {Set} excludedIds - Set of excluded ingredient IDs
 * @returns {boolean} isUpdating - Loading state during API call
 * @returns {string|null} error - Error message or null
 * @returns {Function} toggleIngredient - Toggle ingredient exclusion
 * @returns {Function} applyExclusions - Apply exclusions and get updated recipe
 * @returns {Function} reset - Clear all exclusions
 * 
 * @example
 * const {
 *   excludedIds,
 *   isUpdating,
 *   error,
 *   toggleIngredient,
 *   applyExclusions,
 *   reset
 * } = useIngredientExclusion(recipeId)
 * 
 * // Toggle ingredient
 * toggleIngredient(ingredientId)
 * 
 * // Apply exclusions
 * const updatedRecipe = await applyExclusions()
 * 
 * // Reset
 * reset()
 */
export function useIngredientExclusion(recipeId) {
  const [excludedIds, setExcludedIds] = useState(new Set())
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Toggle an ingredient's exclusion state.
   */
  const toggleIngredient = useCallback((ingredientId) => {
    setExcludedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId)
      } else {
        newSet.add(ingredientId)
      }
      return newSet
    })
    // Clear any previous errors when user makes changes
    setError(null)
  }, [])

  /**
   * Apply exclusions by calling the API.
   * Returns updated recipe data or throws error.
   */
  const applyExclusions = useCallback(async () => {
    if (excludedIds.size === 0) {
      setError('Please select at least one ingredient to exclude.')
      return null
    }

    setIsUpdating(true)
    setError(null)

    try {
      const updatedRecipe = await excludeIngredients(recipeId, Array.from(excludedIds))
      return updatedRecipe
    } catch (err) {
      const errorMessage = err.message || 'Failed to exclude ingredients. Please try again.'
      setError(errorMessage)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [recipeId, excludedIds])

  /**
   * Reset all exclusions and clear errors.
   */
  const reset = useCallback(() => {
    setExcludedIds(new Set())
    setError(null)
  }, [])

  return {
    excludedIds,
    isUpdating,
    error,
    toggleIngredient,
    applyExclusions,
    reset
  }
}

