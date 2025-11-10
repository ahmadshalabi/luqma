import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/Collapsible'
import { Badge } from '@/components/ui/Badge'
import { NutritionContent } from './NutritionContent'

/**
 * CollapsibleNutrition component with expandable nutrition panel.
 * Uses the new Collapsible primitive for consistent behavior.
 *
 * @param {Object} props - Component props
 * @param {Object} props.nutrition - Nutrition data object
 * @param {boolean} [props.defaultExpanded=false] - Initial expanded state
 * @param {boolean} [props.isRecalculated=false] - Show indicator for recalculated values
 * @returns {JSX.Element} CollapsibleNutrition component
 */
export function CollapsibleNutrition({ nutrition, defaultExpanded = false, isRecalculated = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (!nutrition) {
    return null
  }

  const { calories = 0, protein = 0, fat = 0, carbohydrates = 0 } = nutrition
  const hasData = calories > 0 || protein > 0 || fat > 0 || carbohydrates > 0

  if (!hasData) {
    return null
  }

  const badge = isRecalculated ? (
    <Badge
      variant="success"
      size="sm"
      shape="rounded"
      ariaLabel="Nutrition values have been recalculated"
    >
      Updated
    </Badge>
  ) : null

  const subtitle = calories > 0 ? `${Math.round(calories)} calories per serving` : undefined

  return (
    <Collapsible
      trigger={
        <CollapsibleTrigger
          icon="chart"
          title="Nutrition Facts"
          subtitle={subtitle}
          badge={badge}
        />
      }
      defaultExpanded={defaultExpanded}
      controlled={true}
      isExpanded={isExpanded}
      onToggle={setIsExpanded}
      className="rounded-xl"
      id="nutrition-details"
    >
      <CollapsibleContent>
        <NutritionContent nutrition={nutrition} />
      </CollapsibleContent>
    </Collapsible>
  )
}

