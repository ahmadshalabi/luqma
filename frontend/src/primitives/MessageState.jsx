import { memo } from 'react'
import { Icon } from '@/utils/iconRegistry'

/**
 * MessageState Component
 * 
 * Unified component for displaying empty, error, info, or success states.
 * Displays with icon, title, message, and optional action button/link.
 * 
 * @param {Object} props
 * @param {string} props.variant - Display variant ('empty', 'error', 'info', 'success')
 * @param {string} props.icon - Icon name or 'custom' for custom SVG
 * @param {React.ReactNode} props.customIcon - Custom icon element (when icon='custom')
 * @param {string} props.title - State title
 * @param {string} props.message - State message
 * @param {React.ReactNode} props.action - Optional action button or link
 * @param {string} props.className - Additional CSS classes
 */
const MessageStateComponent = ({ 
  variant = 'empty',
  icon = 'lightbulb', 
  customIcon,
  title, 
  message, 
  action,
  className = ''
}) => {
  const variantStyles = {
    empty: {
      iconClasses: 'text-gray-300',
      iconBg: '',
      titleClasses: 'text-gray-900',
      messageClasses: 'text-gray-600',
      role: 'status',
      ariaLive: 'polite'
    },
    error: {
      iconClasses: 'text-red-600',
      iconBg: 'bg-red-100',
      titleClasses: 'text-red-600',
      messageClasses: 'text-gray-600',
      role: 'alert',
      ariaLive: 'assertive'
    },
    info: {
      iconClasses: 'text-blue-600',
      iconBg: 'bg-blue-100',
      titleClasses: 'text-blue-600',
      messageClasses: 'text-gray-600',
      role: 'status',
      ariaLive: 'polite'
    },
    success: {
      iconClasses: 'text-green-600',
      iconBg: 'bg-green-100',
      titleClasses: 'text-green-600',
      messageClasses: 'text-gray-600',
      role: 'status',
      ariaLive: 'polite'
    }
  }

  const styles = variantStyles[variant] || variantStyles.empty
  const defaultIcons = {
    empty: 'lightbulb',
    error: 'close',
    info: 'exclamationCircle',
    success: 'checkCircle'
  }
  const iconName = icon || defaultIcons[variant]

  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
      role={styles.role}
      aria-live={styles.ariaLive}
    >
      {icon === 'custom' && customIcon ? (
        customIcon
      ) : styles.iconBg ? (
        <div className={`flex items-center justify-center w-16 h-16 rounded-full ${styles.iconBg} mb-4`}>
          <Icon name={iconName} className={`w-8 h-8 ${styles.iconClasses}`} />
        </div>
      ) : (
        <Icon name={iconName} className={`w-12 h-12 ${styles.iconClasses} mb-4`} />
      )}

      <h3 className={`text-xl font-semibold ${styles.titleClasses} mb-2`}>
        {title}
      </h3>

      <p className={`text-base ${styles.messageClasses} text-center ${variant === 'error' ? 'max-w-md' : ''}`}>
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

export const MessageState = memo(MessageStateComponent)

