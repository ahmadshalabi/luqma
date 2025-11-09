import { Section } from '@/primitives/Section'

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
    <Section
      title="Ingredients"
      isEmpty={isEmpty}
      emptyMessage="No ingredient information available."
    >
      {exclusionEnabled && (
        <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          💡 Tap <span className="font-medium text-blue-700">Exclude</span> on ingredients you want to remove
        </p>
      )}
      
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => {
          const isExcluded = exclusionEnabled && excludedIds.has(ingredient.id)

          return (
            <li
              key={ingredient.id || index}
              className={`flex items-center justify-between gap-3 transition-all duration-150 ${
                exclusionEnabled 
                  ? 'bg-white border-2 border-gray-200 hover:border-gray-300 rounded-lg p-3 md:p-2' 
                  : 'py-1'
              } ${isExcluded ? 'opacity-50 border-yellow-400 bg-yellow-50' : ''}`}
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {!exclusionEnabled && (
                  <span className="text-blue-600 mt-1 flex-shrink-0" aria-hidden="true">•</span>
                )}
                
                <span className={`text-base md:text-sm leading-relaxed md:leading-normal ${isExcluded ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {ingredient.amount && ingredient.amount > 0 && (
                    <span className="font-medium">
                      {ingredient.amount.toFixed(ingredient.amount % 1 === 0 ? 0 : 1)}
                      {ingredient.unit && ` ${ingredient.unit}`}
                      {' - '}
                    </span>
                  )}
                  <span>{ingredient.name || 'Unknown ingredient'}</span>
                </span>
              </div>
              
              {exclusionEnabled && (
                <button
                  onClick={() => onToggleExclude(ingredient.id)}
                  className={`flex-shrink-0 px-4 py-2 md:px-3 md:py-1.5 rounded-full font-medium text-sm md:text-xs transition-all duration-150 min-h-[40px] md:min-h-0 ${
                    isExcluded 
                      ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400 hover:bg-yellow-200' 
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                  }`}
                  aria-label={isExcluded ? `Include ${ingredient.name}` : `Exclude ${ingredient.name}`}
                  aria-pressed={isExcluded}
                >
                  {isExcluded ? 'Selected' : 'Exclude'}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

