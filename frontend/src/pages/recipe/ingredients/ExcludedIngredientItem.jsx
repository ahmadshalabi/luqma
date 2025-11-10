import { Icon } from '@/utils/iconRegistry'
import { IconButton } from '@/components/ui/IconButton'

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
      <IconButton
        icon="close"
        onClick={() => onRemove(ingredient.id)}
        disabled={disabled}
        ariaLabel={`Remove ${ingredient.name} from exclusions`}
        title="Tap to restore this ingredient"
        variant="ghost"
        size="md"
        className="text-yellow-600 hover:text-yellow-900 hover:bg-yellow-200"
      />
    </li>
  )
}

