import { Icon } from '@/utils/iconRegistry'

/**
 * NutritionHeader component for collapsible nutrition section header.
 * Presentational component.
 * 
 * @param {Object} props
 * @param {boolean} props.isExpanded - Expanded state
 * @param {boolean} [props.isRecalculated=false] - Recalculated indicator
 * @param {number} [props.calories=0] - Calories value
 * @param {Function} props.onToggle - Toggle handler
 */
export function NutritionHeader({ isExpanded, isRecalculated = false, calories = 0, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      aria-expanded={isExpanded}
      aria-controls="nutrition-details"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="chart" className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Nutrition Facts
            </h2>
            {isRecalculated && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                role="status"
                aria-label="Nutrition values have been recalculated"
              >
                Updated
              </span>
            )}
          </div>
          {calories > 0 && (
            <p className="text-sm text-gray-600">
              {Math.round(calories)} calories per serving
            </p>
          )}
        </div>
      </div>

      <Icon 
        name="chevronDown"
        className={`w-5 h-5 text-gray-400 transition-transform duration-[600ms] ${isExpanded ? 'rotate-180' : ''}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </button>
  )
}

