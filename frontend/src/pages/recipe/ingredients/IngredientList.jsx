import { Section } from '@/components/ui/Section'
import { Alert } from '@/components/ui/Alert'
import { IngredientItem } from '@/components/recipe/ingredients/IngredientItem'

/**
 * IngredientList component displaying recipe ingredients with measurements.
 * Supports ingredient exclusion with tap-to-exclude buttons.
 *
 * @param {Object} props - Component props
 * @param {Array} props.ingredients - Array of ingredient objects
 * @param {Set} [props.excludedIds] - Set of excluded ingredient IDs
 * @param {Function} [props.onToggleExclude] - Handler for exclude toggle
 * @returns {JSX.Element} IngredientList component
 */
export function IngredientList({ ingredients, excludedIds, onToggleExclude }) {
  const isEmpty = !ingredients || ingredients.length === 0
  const exclusionEnabled = excludedIds !== undefined && onToggleExclude !== undefined

  return (
    <Section title="Ingredients">
      {isEmpty ? (
        <Alert
          variant="info"
          message="No ingredient information available."
        />
      ) : (
        <>
          {exclusionEnabled && (
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              💡 Tap <span className="font-medium text-blue-700">Exclude</span> on ingredients you want to remove
            </p>
          )}
          
          <ul className="space-y-2">
            {ingredients.map((ingredient, index) => {
              const isExcluded = exclusionEnabled && excludedIds.has(ingredient.id)

              return (
                <IngredientItem
                  key={ingredient.id || index}
                  ingredient={ingredient}
                  isExcluded={isExcluded}
                  exclusionEnabled={exclusionEnabled}
                  onToggleExclude={onToggleExclude}
                />
              )
            })}
          </ul>
        </>
      )}
    </Section>
  )
}

