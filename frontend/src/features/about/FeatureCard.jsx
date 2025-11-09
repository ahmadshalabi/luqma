import { memo } from 'react'
import { Icon } from '@/primitives/Icon'
import { Card } from '@/primitives/Card'
import { getColorClasses } from '@/utils/colorUtils'

/**
 * FeatureCard Component
 * 
 * Card displaying a feature with icon, title, and description.
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon name (from Icon component)
 * @param {string} props.iconColor - Icon color variant (blue, green, purple, red, etc.)
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @param {string} props.className - Additional CSS classes
 */
const FeatureCardComponent = ({ icon, iconColor = 'blue', title, description, className = '' }) => {
  const iconClass = getColorClasses(iconColor, 'combined')

  return (
    <Card className={`flex flex-col space-y-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-lg ${iconClass}`}>
          <Icon name={icon} size="lg" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>
      </div>
      <p className="text-base text-gray-700 leading-relaxed">
        {description}
      </p>
    </Card>
  )
}

export const FeatureCard = memo(FeatureCardComponent)

