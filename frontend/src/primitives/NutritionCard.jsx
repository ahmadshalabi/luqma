import { memo } from 'react'

/**
 * NutritionCard component displaying a single macronutrient with progress bar.
 * Reusable component for consistent nutrition display across the app.
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Nutrient label (e.g., "Protein", "Fat")
 * @param {number} props.value - Nutrient value in grams
 * @param {string} props.unit - Unit of measurement (default: "g")
 * @param {number} [props.percentage] - Percentage for progress bar (0-100)
 * @param {string} props.color - Color variant (green, orange, blue, purple, red)
 * @param {string} [props.percentageLabel] - Custom percentage label (default: shows percentage)
 * @param {boolean} [props.showProgressBar=true] - Whether to show progress bar
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} NutritionCard component
 */
function NutritionCardComponent({ 
  label, 
  value, 
  unit = 'g',
  percentage = 0, 
  color = 'blue',
  percentageLabel,
  showProgressBar = true,
  className = ''
}) {
  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      textLight: 'text-green-700',
      progressBg: 'bg-green-200',
      progressBar: 'bg-green-500'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      textLight: 'text-orange-700',
      progressBg: 'bg-orange-200',
      progressBar: 'bg-orange-500'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      textLight: 'text-blue-700',
      progressBg: 'bg-blue-200',
      progressBar: 'bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      textLight: 'text-purple-700',
      progressBg: 'bg-purple-200',
      progressBar: 'bg-purple-500'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      textLight: 'text-red-700',
      progressBg: 'bg-red-200',
      progressBar: 'bg-red-500'
    }
  }

  const colors = colorClasses[color] || colorClasses.blue
  const displayPercentageLabel = percentageLabel || `${Math.round(percentage)}%`

  return (
    <div className={`${colors.bg} p-3 md:p-4 rounded-lg border ${colors.border} ${className}`}>
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${colors.text} uppercase tracking-wide mb-1.5 md:mb-2`}>
          {label}
        </span>
        <div className="flex items-baseline gap-1 mb-1.5 md:mb-2">
          <span className={`text-xl md:text-2xl font-bold ${colors.text}`}>
            {value.toFixed(value % 1 === 0 ? 0 : 1)}
          </span>
          <span className={`text-xs md:text-sm ${colors.textLight}`}>
            {unit}
          </span>
        </div>
        {showProgressBar && (
          <>
            <div className={`w-full ${colors.progressBg} rounded-full h-1.5 md:h-2`}>
              <div 
                className={`${colors.progressBar} h-1.5 md:h-2 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${label} percentage`}
              />
            </div>
            <span className={`text-xs ${colors.textLight} mt-1`}>
              {displayPercentageLabel}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export const NutritionCard = memo(NutritionCardComponent)

