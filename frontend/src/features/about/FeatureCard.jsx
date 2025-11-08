import { memo } from 'react'
import { Icon } from '@/primitives/Icon'

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
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  }

  const iconClass = colorClasses[iconColor] || colorClasses.blue

  return (
    <div className={`flex flex-col p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
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
    </div>
  )
}

export const FeatureCard = memo(FeatureCardComponent)

