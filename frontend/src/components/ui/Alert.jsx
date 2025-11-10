import { Icon } from '@/utils/iconRegistry'

/**
 * Alert component for displaying various alert messages and states.
 * 
 * @param {Object} props
 * @param {'error'|'success'|'warning'|'info'|'empty'} [props.variant='info'] - Alert variant
 * @param {string} [props.title] - Alert title
 * @param {string} [props.message] - Alert message text
 * @param {string} [props.icon] - Icon name (overrides default variant icon)
 * @param {React.ReactNode} [props.action] - Action button or element
 * @param {string} [props.className] - Additional CSS classes
 */
export function Alert({
  variant = 'info',
  title,
  message,
  icon,
  action,
  className = ''
}) {
  const variantConfig = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
      defaultIcon: 'exclamationCircle'
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-700',
      defaultIcon: 'checkCircle'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700',
      defaultIcon: 'exclamationTriangle'
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700',
      defaultIcon: 'info'
    },
    empty: {
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-400',
      titleColor: 'text-gray-900',
      textColor: 'text-gray-600',
      defaultIcon: 'lightbulb'
    }
  }
  
  const config = variantConfig[variant]
  const iconName = icon || config.defaultIcon
  const role = variant === 'error' ? 'alert' : 'status'
  const ariaLive = variant === 'error' ? 'assertive' : 'polite'
  
  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-6 ${className}`}
      role={role}
      aria-live={ariaLive}
    >
      <div className="flex items-start gap-4">
        <Icon 
          name={iconName} 
          className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`}
        />
        <div className="flex-1 space-y-2">
          {title && (
            <h3 className={`text-lg font-semibold ${config.titleColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <p className={`text-base ${config.textColor}`}>
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
    </div>
  )
}

