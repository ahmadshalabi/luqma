import { useState, useEffect, useRef } from 'react'
import { NutritionCard } from '@/primitives/NutritionCard'
import { Icon } from '@/utils/iconRegistry'

/**
 * CollapsibleNutrition component with expandable nutrition panel.
 *
 * @param {Object} props - Component props
 * @param {Object} props.nutrition - Nutrition data object
 * @param {boolean} [props.defaultExpanded=false] - Initial expanded state
 * @param {boolean} [props.forceExpand=false] - Force expand from parent
 * @param {boolean} [props.isRecalculated=false] - Show indicator for recalculated values
 * @returns {JSX.Element} CollapsibleNutrition component
 */
export function CollapsibleNutrition({ nutrition, defaultExpanded = false, forceExpand = false, isRecalculated = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [contentHeight, setContentHeight] = useState(0)
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (forceExpand) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    }
  }, [forceExpand])

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [nutrition])

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }

    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const shouldExpand = isExpanded || forceExpand

  if (!nutrition) {
    return null
  }

  const {
    calories = 0,
    protein = 0,
    fat = 0,
    carbohydrates = 0,
    fiber = 0,
    percentProtein = 0,
    percentFat = 0,
    percentCarbs = 0
  } = nutrition

  const hasData = calories > 0 || protein > 0 || fat > 0 || carbohydrates > 0

  if (!hasData) {
    return null
  }

  return (
    <div ref={sectionRef} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-expanded={shouldExpand}
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
          className={`w-5 h-5 text-gray-400 transition-transform duration-[600ms] ${shouldExpand ? 'rotate-180' : ''}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </button>

      <div
        id="nutrition-details"
        className="overflow-hidden"
        style={{
          maxHeight: shouldExpand ? `${contentHeight}px` : '0',
          opacity: shouldExpand ? 1 : 0,
          transition: 'max-height 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div ref={contentRef} className="p-3 md:p-5 pt-3 md:pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {calories > 0 && (
              <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-4 rounded-lg border border-blue-200">
                <div className="text-center">
                  <span className="text-xs font-medium text-blue-900 uppercase tracking-wide block mb-1">Calories</span>
                  <span className="text-2xl md:text-3xl font-bold text-blue-900 block">
                    {calories.toFixed(0)}
                  </span>
                  <span className="text-xs text-blue-700">kcal</span>
                </div>
              </div>
            )}

            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {protein > 0 && (
                <NutritionCard
                  label="Protein"
                  value={protein}
                  percentage={percentProtein}
                  color="green"
                />
              )}

              {fat > 0 && (
                <NutritionCard
                  label="Fat"
                  value={fat}
                  percentage={percentFat}
                  color="orange"
                />
              )}

              {carbohydrates > 0 && (
                <NutritionCard
                  label="Carbs"
                  value={carbohydrates}
                  percentage={percentCarbs}
                  color="blue"
                />
              )}

              {fiber > 0 && (
                <NutritionCard
                  label="Fiber"
                  value={fiber}
                  percentage={20}
                  percentageLabel="Essential"
                  color="purple"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

