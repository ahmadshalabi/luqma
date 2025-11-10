import { Icon } from '@/utils/iconRegistry'

/**
 * ExcludedIngredientItem primitive component for displaying a single excluded ingredient.
 * Presentational component.
 * 
 * @param {Object} props
 * @param {Object} props.ingredient - Ingredient data
 * @param {Function} props.onRemove - Handler for remove button
 * @param {boolean} [props.disabled=false] - Disabled state
 */
export function ExcludedIngredientItem({ ingredient, onRemove, disabled = false }) {
  return (
    <li 
      className="flex items-center justify-between gap-3 text-sm md:text-xs text-yellow-700 bg-yellow-100 rounded-lg md:rounded px-3 py-3 md:px-2 md:py-1.5"
    >
      <div className="flex items-center gap-2 md:gap-1.5 flex-1">
        <Icon name="minus" className="w-5 h-5 md:w-4 md:h-4 text-yellow-600 flex-shrink-0" />
        <span className="flex-1">{ingredient.name}</span>
      </div>
      <button
        onClick={() => onRemove(ingredient.id)}
        disabled={disabled}
        className="text-yellow-600 hover:text-yellow-900 hover:bg-yellow-200 rounded-lg md:rounded p-2 md:p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center"
        aria-label={`Remove ${ingredient.name} from exclusions`}
        title="Tap to restore this ingredient"
      >
        <Icon name="close" className="w-5 h-5 md:w-4 md:h-4" />
      </button>
    </li>
  )
}

