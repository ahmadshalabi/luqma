import { memo, useMemo } from 'react'
import { getColorClasses } from '@/utils/colorUtils'

/**
 * NutritionCard component for displaying a single nutrition metric.
 * Memoized to prevent unnecessary re-renders when props haven't changed.
 * 
 * @param {Object} props
 * @param {string} props.label - Nutrient label
 * @param {number} props.value - Nutrient value
 * @param {number} [props.percentage] - Percentage value
 * @param {string} [props.percentageLabel='Daily Value'] - Percentage label text
 * @param {'green'|'orange'|'blue'|'purple'} [props.color='blue'] - Color theme
 */
const NutritionCardComponent = ({
  label,
  value,
  percentage,
  percentageLabel = 'Daily Value',
  color = 'blue'
}) => {
  const colorClasses = useMemo(() => getColorClasses(color), [color])
  const { bgFrom, bgTo, border, textPrimary, textSecondary } = colorClasses

  return (
    <div className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-3 md:p-4 rounded-lg border ${border}`}>
      <div className="text-center">
        <span className={`text-xs font-medium ${textPrimary} uppercase tracking-wide block mb-1`}>
          {label}
        </span>
        <span className={`text-xl md:text-2xl font-bold ${textPrimary} block`}>
          {value.toFixed(1)}
        </span>
        <span className={`text-xs ${textSecondary}`}>g</span>
        {percentage !== undefined && (
          <div className="mt-2 pt-2 border-t border-current/20">
            <span className={`text-xs ${textSecondary} block`}>
              {percentage.toFixed(0)}% {percentageLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export const NutritionCard = memo(NutritionCardComponent)

