import { useState, useEffect } from 'react'
import { RecipeHeader } from './RecipeHeader'
import { IngredientList } from './IngredientList'
import { CollapsibleNutrition } from './CollapsibleNutrition'
import { InstructionList } from './InstructionList'
import { IngredientExclusionPanel } from './IngredientExclusionPanel'
import { ExcludedIngredientsList } from './ExcludedIngredientsList'
import { useIngredientExclusion } from '@/hooks/useIngredientExclusion'
import { excludeIngredients } from '@/services/apiClient'

/**
 * RecipeDetail component composing all recipe detail sub-components.
 * Supports ingredient exclusion with real-time nutrition recalculation.
 *
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Complete recipe data object
 * @returns {JSX.Element} RecipeDetail component
 */
export function RecipeDetail({ recipe }) {
  const [currentRecipe, setCurrentRecipe] = useState(recipe)
  const [isRecalculated, setIsRecalculated] = useState(false)
  const [excludedIngredients, setExcludedIngredients] = useState([])
  const [allExcludedIds, setAllExcludedIds] = useState(new Set())
  const [isUpdating, setIsUpdating] = useState(false)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    setCurrentRecipe(recipe)
    setIsRecalculated(false)
    setExcludedIngredients([])
    setAllExcludedIds(new Set())
    setApiError(null)
  }, [recipe])

  const {
    excludedIds,
    toggleIngredient,
    reset
  } = useIngredientExclusion(recipe?.id)

  const handleToggleIngredient = (id) => {
    toggleIngredient(id)
    setApiError(null)
  }

  if (!currentRecipe) {
    return null
  }

  const handleApplyExclusions = async () => {
    if (excludedIds.size === 0) {
      setApiError('Please select at least one ingredient to exclude.')
      return
    }

    setIsUpdating(true)
    setApiError(null)

    try {
      const cumulativeExcludedIds = new Set([...allExcludedIds, ...excludedIds])
      const updatedRecipe = await excludeIngredients(recipe.id, Array.from(cumulativeExcludedIds))
      const newlyExcluded = recipe.ingredients.filter(ing => excludedIds.has(ing.id))
      setExcludedIngredients([...excludedIngredients, ...newlyExcluded])
      setAllExcludedIds(cumulativeExcludedIds)
      setCurrentRecipe(updatedRecipe)
      setIsRecalculated(true)
      reset()
    } catch (err) {
      console.error('Failed to apply exclusions:', err)
      setApiError(err.message || 'Failed to exclude ingredients. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveExclusion = async (ingredientId) => {
    setIsUpdating(true)
    setApiError(null)

    try {
      const updatedExcludedIds = new Set(allExcludedIds)
      updatedExcludedIds.delete(ingredientId)

      if (updatedExcludedIds.size === 0) {
        handleReset()
        return
      }

      const updatedRecipe = await excludeIngredients(recipe.id, Array.from(updatedExcludedIds))
      const updatedExcludedIngredients = excludedIngredients.filter(ing => ing.id !== ingredientId)
      setExcludedIngredients(updatedExcludedIngredients)
      setAllExcludedIds(updatedExcludedIds)
      
      setCurrentRecipe(updatedRecipe)
      setIsRecalculated(true)
    } catch (err) {
      console.error('Failed to remove exclusion:', err)
      setApiError(err.message || 'Failed to update recipe. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReset = () => {
    reset()
    setCurrentRecipe(recipe)
    setIsRecalculated(false)
    setExcludedIngredients([])
    setAllExcludedIds(new Set())
    setApiError(null)
  }

  const calories = currentRecipe.nutrition?.calories || 0

  return (
    <article className="max-w-7xl mx-auto space-y-8 pb-32 lg:pb-8">
      <RecipeHeader
        title={currentRecipe.title}
        image={currentRecipe.image}
        readyInMinutes={currentRecipe.readyInMinutes}
        servings={currentRecipe.servings}
        calories={calories}
      />

      <CollapsibleNutrition
        nutrition={currentRecipe.nutrition}
        isRecalculated={isRecalculated}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4 space-y-4">
            <IngredientList
              ingredients={currentRecipe.ingredients || []}
              excludedIds={excludedIds}
              onToggleExclude={handleToggleIngredient}
            />

            <IngredientExclusionPanel
              excludedCount={excludedIds.size}
              isUpdating={isUpdating}
              error={apiError}
              onApply={handleApplyExclusions}
              onReset={handleReset}
            />

            <ExcludedIngredientsList
              excludedIngredients={excludedIngredients}
              onRemoveExclusion={handleRemoveExclusion}
              onResetAll={handleReset}
              isUpdating={isUpdating}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <InstructionList instructions={currentRecipe.instructions || []} />
        </div>
      </div>
    </article>
  )
}

