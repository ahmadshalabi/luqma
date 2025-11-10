import { useContext } from 'react'
import { RecipeExclusionContext } from '@/contexts/RecipeExclusionContext'

/**
 * Hook to use the recipe exclusion context.
 * Must be used within a RecipeExclusionProvider.
 * 
 * @returns {Object} Recipe exclusion context value
 * @throws {Error} If used outside RecipeExclusionProvider
 * 
 * @example
 * const { currentRecipe, excludedIds, toggleIngredient } = useRecipeExclusion()
 */
export function useRecipeExclusion() {
  const context = useContext(RecipeExclusionContext)
  
  if (!context) {
    throw new Error('useRecipeExclusion must be used within a RecipeExclusionProvider')
  }
  
  return context
}

