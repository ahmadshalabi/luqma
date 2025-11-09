import { RecipeHeader } from './RecipeHeader'
import { IngredientList } from './IngredientList'
import { CollapsibleNutrition } from './CollapsibleNutrition'
import { InstructionList } from './InstructionList'

/**
 * RecipeDetail component composing all recipe detail sub-components.
 *
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Complete recipe data object
 * @returns {JSX.Element} RecipeDetail component
 */
export function RecipeDetail({ recipe }) {
  if (!recipe) {
    return null
  }

  const calories = recipe.nutrition?.calories || 0

  return (
    <article className="max-w-7xl mx-auto space-y-8">
      <RecipeHeader
        title={recipe.title}
        image={recipe.image}
        readyInMinutes={recipe.readyInMinutes}
        servings={recipe.servings}
        calories={calories}
      />

      <CollapsibleNutrition
        nutrition={recipe.nutrition}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <IngredientList ingredients={recipe.ingredients || []} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <InstructionList instructions={recipe.instructions || []} />
        </div>
      </div>
    </article>
  )
}

