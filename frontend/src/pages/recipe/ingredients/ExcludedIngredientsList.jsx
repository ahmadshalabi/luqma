import { Icon } from '@/utils/iconRegistry'
import { ExcludedIngredientItem } from './ExcludedIngredientItem'

/**
 * ExcludedIngredientsList component displaying ingredients that have been excluded.
 * Shows a list of excluded ingredients with ability to remove individual items or reset all.
 * 
 * @param {Object} props
 * @param {Array} props.excludedIngredients - Array of excluded ingredient objects
 * @param {Function} props.onRemoveExclusion - Handler for removing a single exclusion
 * @param {Function} props.onResetAll - Handler for resetting all exclusions
 * @param {boolean} [props.isUpdating=false] - Loading state during API calls
 */
export function ExcludedIngredientsList({
  excludedIngredients,
  onRemoveExclusion,
  onResetAll,
  isUpdating = false
}) {
  if (!excludedIngredients || excludedIngredients.length === 0) {
    return null
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-4">
      <div className="space-y-4 md:space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 md:gap-2">
            <Icon name="info" className="w-5 h-5 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-base md:text-sm font-medium text-yellow-800">
                Excluded Ingredients ({excludedIngredients.length})
              </p>
            </div>
          </div>
          <button
            onClick={onResetAll}
            disabled={isUpdating}
            className="text-sm md:text-xs text-yellow-700 hover:text-yellow-900 underline disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] md:min-h-0 flex items-center"
            aria-label="Reset all exclusions"
          >
            Reset All
          </button>
        </div>
        
        <ul className="space-y-2 md:space-y-2">
          {excludedIngredients.map((ingredient, index) => (
            <ExcludedIngredientItem
              key={ingredient.id || index}
              ingredient={ingredient}
              onRemove={onRemoveExclusion}
              disabled={isUpdating}
            />
          ))}
        </ul>
        
        <p className="text-sm md:text-xs text-yellow-700 mt-2">
          Tap <span className="font-medium">X</span> to restore individual ingredients or <span className="font-medium">Reset All</span> to restore everything
        </p>
      </div>
    </div>
  )
}

