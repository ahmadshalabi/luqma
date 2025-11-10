import { RecipeMetadataBadge } from './RecipeMetadataBadge'

/**
 * RecipeMetadataGroup component for displaying multiple metadata badges.
 * Presentational component.
 * 
 * @param {Object} props
 * @param {number} [props.readyInMinutes] - Preparation time
 * @param {number} [props.servings] - Number of servings
 * @param {number} [props.calories] - Calories per serving
 * @param {'mobile'|'desktop'} [props.variant='mobile'] - Display variant
 */
export function RecipeMetadataGroup({ readyInMinutes, servings, calories, variant = 'mobile' }) {
  if (!readyInMinutes && !servings && !calories) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {readyInMinutes && readyInMinutes > 0 && (
        <RecipeMetadataBadge icon="clock" variant={variant}>
          {readyInMinutes} min
        </RecipeMetadataBadge>
      )}

      {servings && servings > 0 && (
        <RecipeMetadataBadge icon="users" variant={variant}>
          {servings} {servings === 1 ? 'serving' : 'servings'}
        </RecipeMetadataBadge>
      )}

      {calories && calories > 0 && (
        <RecipeMetadataBadge icon="chartBar" variant={variant}>
          {Math.round(calories)} cal
        </RecipeMetadataBadge>
      )}
    </div>
  )
}

