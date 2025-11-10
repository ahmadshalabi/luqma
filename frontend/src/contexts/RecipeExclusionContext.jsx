import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { excludeIngredients } from '@/services/apiClient'

const RecipeExclusionContext = createContext(null)

/**
 * Provider for recipe exclusion state management.
 * Centralizes all exclusion logic including cumulative exclusions and nutrition recalculation.
 * 
 * @param {Object} props
 * @param {Object} props.initialRecipe - Initial recipe data
 * @param {React.ReactNode} props.children - Child components
 */
export function RecipeExclusionProvider({ initialRecipe, children }) {
  // Current recipe state (may have exclusions applied)
  const [currentRecipe, setCurrentRecipe] = useState(initialRecipe)
  
  // Track whether we've recalculated (for UI feedback)
  const [isRecalculated, setIsRecalculated] = useState(false)
  
  // List of excluded ingredients (for display)
  const [excludedIngredients, setExcludedIngredients] = useState([])
  
  // Cumulative set of all excluded ingredient IDs
  const [allExcludedIds, setAllExcludedIds] = useState(new Set())
  
  // Current selection of ingredient IDs to exclude
  const [excludedIds, setExcludedIds] = useState(new Set())
  
  // Async operation state
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)

  // Reset everything when initial recipe changes
  useEffect(() => {
    setCurrentRecipe(initialRecipe)
    setIsRecalculated(false)
    setExcludedIngredients([])
    setAllExcludedIds(new Set())
    setExcludedIds(new Set())
    setError(null)
  }, [initialRecipe])

  /**
   * Toggle an ingredient's exclusion state in current selection.
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
    setError(null)
  }, [])

  /**
   * Apply current exclusion selection and recalculate nutrition.
   */
  const applyExclusions = useCallback(async () => {
    if (excludedIds.size === 0) {
      setError('Please select at least one ingredient to exclude.')
      return
    }

    setIsUpdating(true)
    setError(null)

    try {
      // Combine with previously excluded IDs for cumulative effect
      const cumulativeExcludedIds = new Set([...allExcludedIds, ...excludedIds])
      
      // Call API with all excluded IDs
      const updatedRecipe = await excludeIngredients(
        initialRecipe.id, 
        Array.from(cumulativeExcludedIds)
      )
      
      // Track newly excluded ingredients for display
      const newlyExcluded = initialRecipe.ingredients.filter(
        ing => excludedIds.has(ing.id)
      )
      
      // Update state
      setExcludedIngredients([...excludedIngredients, ...newlyExcluded])
      setAllExcludedIds(cumulativeExcludedIds)
      setCurrentRecipe(updatedRecipe)
      setIsRecalculated(true)
      
      // Clear current selection
      setExcludedIds(new Set())
    } catch (err) {
      console.error('Failed to apply exclusions:', err)
      setError(err.message || 'Failed to exclude ingredients. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }, [excludedIds, allExcludedIds, excludedIngredients, initialRecipe])

  /**
   * Remove a single excluded ingredient and recalculate.
   */
  const removeExclusion = useCallback(async (ingredientId) => {
    setIsUpdating(true)
    setError(null)

    try {
      // Remove from cumulative set
      const updatedExcludedIds = new Set(allExcludedIds)
      updatedExcludedIds.delete(ingredientId)

      // If no more exclusions, reset to original
      if (updatedExcludedIds.size === 0) {
        setCurrentRecipe(initialRecipe)
        setIsRecalculated(false)
        setExcludedIngredients([])
        setAllExcludedIds(new Set())
        setExcludedIds(new Set())
        setError(null)
        return
      }

      // Recalculate with remaining exclusions
      const updatedRecipe = await excludeIngredients(
        initialRecipe.id, 
        Array.from(updatedExcludedIds)
      )
      
      // Update excluded ingredients list
      const updatedExcludedIngredients = excludedIngredients.filter(
        ing => ing.id !== ingredientId
      )
      
      setExcludedIngredients(updatedExcludedIngredients)
      setAllExcludedIds(updatedExcludedIds)
      setCurrentRecipe(updatedRecipe)
      setIsRecalculated(true)
    } catch (err) {
      console.error('Failed to remove exclusion:', err)
      setError(err.message || 'Failed to update recipe. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }, [allExcludedIds, excludedIngredients, initialRecipe])

  /**
   * Reset everything to original recipe state.
   */
  const resetAll = useCallback(() => {
    setExcludedIds(new Set())
    setCurrentRecipe(initialRecipe)
    setIsRecalculated(false)
    setExcludedIngredients([])
    setAllExcludedIds(new Set())
    setError(null)
  }, [initialRecipe])

  const value = useMemo(() => ({
    currentRecipe,
    isRecalculated,
    excludedIngredients,
    excludedIds,
    isUpdating,
    error,
    toggleIngredient,
    applyExclusions,
    removeExclusion,
    resetAll
  }), [
    currentRecipe,
    isRecalculated,
    excludedIngredients,
    excludedIds,
    isUpdating,
    error,
    toggleIngredient,
    applyExclusions,
    removeExclusion,
    resetAll
  ])

  return (
    <RecipeExclusionContext.Provider value={value}>
      {children}
    </RecipeExclusionContext.Provider>
  )
}

/**
 * Hook to use the recipe exclusion context.
 * Must be used within a RecipeExclusionProvider.
 */
export function useRecipeExclusion() {
  const context = useContext(RecipeExclusionContext)
  
  if (!context) {
    throw new Error('useRecipeExclusion must be used within a RecipeExclusionProvider')
  }
  
  return context
}

