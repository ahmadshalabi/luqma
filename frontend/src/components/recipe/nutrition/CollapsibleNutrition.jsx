import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { NutritionHeader } from './NutritionHeader'
import { NutritionContent } from './NutritionContent'
import { StatusRegion } from '@/components/ui/LiveRegion'

/**
 * CollapsibleNutrition component with expandable nutrition panel.
 * Pure functional component without side effects.
 * Uses useMemo to optimize data validation check.
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

  // Memoize validation check to avoid recalculating on every render
  const hasData = useMemo(() => {
    if (!nutrition) return false
    const { calories = 0, protein = 0, fat = 0, carbohydrates = 0 } = nutrition
    return calories > 0 || protein > 0 || fat > 0 || carbohydrates > 0
  }, [nutrition])

  // Memoize toggle handler to prevent unnecessary re-renders of child components
  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  if (!nutrition || !hasData) {
    return null
  }

  const { calories = 0 } = nutrition

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out">
      {/* Screen reader announcement for nutrition recalculation */}
      {isRecalculated && (
        <StatusRegion>
          Nutrition information updated based on excluded ingredients. New calorie count: {calories.toFixed(0)} calories.
        </StatusRegion>
      )}
      
      <NutritionHeader
        isExpanded={isExpanded}
        isRecalculated={isRecalculated}
        calories={calories}
        onToggle={handleToggle}
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

