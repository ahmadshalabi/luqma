import { Icon } from '@/utils/iconRegistry'

/**
 * EmptyState component for displaying empty states, no results, and placeholder content.
 * More semantic than using Alert component for empty states.
 * 
 * @param {Object} props
 * @param {string} [props.icon='lightbulb'] - Icon name from icon registry
 * @param {string} props.title - Empty state title
 * @param {string} [props.message] - Empty state message/description
 * @param {React.ReactNode} [props.action] - Action button or element
 * @param {React.ReactNode} [props.illustration] - Custom illustration/SVG
 * @param {'default'|'compact'} [props.size='default'] - Size variant
 * @param {string} [props.className] - Additional CSS classes
 */
export function EmptyState({
  icon = 'lightbulb',
  title,
  message,
  action,
  illustration,
  size = 'default',
  className = ''
}) {
  const containerClasses = size === 'compact' 
    ? 'bg-gray-50 border-2 border-gray-200 rounded-lg p-4'
    : 'bg-gray-50 border-2 border-gray-200 rounded-lg p-6 md:p-8'
  
  const iconSizeClass = size === 'compact' ? 'w-10 h-10' : 'w-12 h-12 md:w-16 md:h-16'
  const iconContainerClass = size === 'compact' 
    ? 'w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'
    : 'w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'
  
  const titleSizeClass = size === 'compact' ? 'text-lg' : 'text-xl md:text-2xl'
  const messageSizeClass = size === 'compact' ? 'text-sm' : 'text-base'
  
  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="text-center max-w-md mx-auto">
        {illustration ? (
          <div className="mb-4">
            {illustration}
          </div>
        ) : (
          <div className={iconContainerClass}>
            <Icon 
              name={icon} 
              className={`${iconSizeClass} text-gray-400`}
              aria-hidden="true"
            />
          </div>
        )}
        
        <h3 className={`${titleSizeClass} font-semibold text-gray-900 mb-2`}>
          {title}
        </h3>
        
        {message && (
          <p className={`${messageSizeClass} text-gray-600 leading-relaxed mb-4`}>
            {message}
          </p>
        )}
        
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

