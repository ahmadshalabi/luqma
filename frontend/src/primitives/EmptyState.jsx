import { memo } from 'react'
import { 
  LightBulbIcon, 
  MagnifyingGlassIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

/**
 * EmptyState Component
 * 
 * Displays an empty state with icon, title, message, and optional action button/link.
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon name (lightbulb, search, clock, checkCircle, xMark) or 'custom' for custom SVG
 * @param {React.ReactNode} props.customIcon - Custom icon element (when icon='custom')
 * @param {string} props.title - Empty state title
 * @param {string} props.message - Empty state message
 * @param {React.ReactNode} props.action - Optional action button or link
 * @param {string} props.className - Additional CSS classes
 */
const EmptyStateComponent = ({ 
  icon = 'lightbulb', 
  customIcon,
  title, 
  message, 
  action,
  className = ''
}) => {
  // Map icon names to Heroicon components
  const iconMap = {
    lightbulb: LightBulbIcon,
    search: MagnifyingGlassIcon,
    clock: ClockIcon,
    checkCircle: CheckCircleIcon,
    xMark: XMarkIcon
  }

  const IconComponent = iconMap[icon] || LightBulbIcon

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`} aria-live="polite">
      {icon === 'custom' && customIcon ? (
        customIcon
      ) : (
        <IconComponent className="w-12 h-12 text-gray-300 mb-4" />
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-base text-gray-600 text-center">
        {message}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

export const EmptyState = memo(EmptyStateComponent)

