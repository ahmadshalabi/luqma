import { useRecipeExclusion } from '@/hooks/useRecipeExclusion'
import { RecipeHeader } from './RecipeHeader'
import { IngredientList } from '@/pages/recipe/ingredients/IngredientList'
import { CollapsibleNutrition } from '@/pages/recipe/nutrition/CollapsibleNutrition'
import { InstructionList } from '@/pages/recipe/instructions/InstructionList'
import { IngredientExclusionPanel } from '@/pages/recipe/ingredients/IngredientExclusionPanel'
import { ExcludedIngredientsList } from '@/pages/recipe/ingredients/ExcludedIngredientsList'

/**
 * RecipeDetail component composing all recipe detail sub-components.
 * Supports ingredient exclusion with real-time nutrition recalculation via Context.
 *
 * @returns {JSX.Element} RecipeDetail component
 */
export function RecipeDetail() {
  // Get all state and methods from Context
  const {
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
  } = useRecipeExclusion()

  if (!currentRecipe) {
    return null
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
              onToggleExclude={toggleIngredient}
            />

            <IngredientExclusionPanel
              excludedCount={excludedIds.size}
              isUpdating={isUpdating}
              error={error}
              onApply={applyExclusions}
              onReset={resetAll}
            />

            <ExcludedIngredientsList
              excludedIngredients={excludedIngredients}
              onRemoveExclusion={removeExclusion}
              onResetAll={resetAll}
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

