import { memo } from 'react'
import { Icon } from './Icon'

/**
 * ErrorState Component
 * 
 * Displays an error state with icon, title, message, and optional action button/link.
 * Includes proper ARIA role for accessibility (announces errors to screen readers).
 * 
 * @param {Object} props
 * @param {string} props.title - Error title (default: "Error")
 * @param {string} props.message - Error message (required)
 * @param {React.ReactNode} props.action - Optional action button or link
 * @param {string} props.icon - Icon name (default: "close")
 * @param {string} props.className - Additional CSS classes
 */
const ErrorStateComponent = ({ 
  title = 'Error', 
  message, 
  action,
  icon = 'close',
  className = ''
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`} 
      role="alert"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <Icon name={icon} size="xl" className="text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">{title}</h3>
      <p className="text-base text-gray-600 text-center max-w-md">
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

export const ErrorState = memo(ErrorStateComponent)

