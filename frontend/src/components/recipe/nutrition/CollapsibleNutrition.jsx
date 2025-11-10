import { useState, useEffect, useRef } from 'react'
import { NutritionHeader } from './NutritionHeader'
import { NutritionContent } from './NutritionContent'

/**
 * CollapsibleNutrition component with expandable nutrition panel.
 * Pure functional component without side effects.
 *
 * @param {Object} props - Component props
 * @param {Object} props.nutrition - Nutrition data object
 * @param {boolean} [props.defaultExpanded=false] - Initial expanded state
 * @param {boolean} [props.isRecalculated=false] - Show indicator for recalculated values
 * @returns {JSX.Element} CollapsibleNutrition component
 */
export function CollapsibleNutrition({ nutrition, defaultExpanded = false, isRecalculated = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef(null)

  // Update height when nutrition data changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [nutrition])

  // Update height on window resize
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }

    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  if (!nutrition) {
    return null
  }

  const { calories = 0, protein = 0, fat = 0, carbohydrates = 0 } = nutrition
  const hasData = calories > 0 || protein > 0 || fat > 0 || carbohydrates > 0

  if (!hasData) {
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out">
      <NutritionHeader
        isExpanded={isExpanded}
        isRecalculated={isRecalculated}
        calories={calories}
        onToggle={() => setIsExpanded(!isExpanded)}
      />

      <div
        id="nutrition-details"
        className="overflow-hidden"
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0',
          opacity: isExpanded ? 1 : 0,
          transition: 'max-height 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div ref={contentRef}>
          <NutritionContent nutrition={nutrition} />
        </div>
      </div>
    </div>
  )
}

