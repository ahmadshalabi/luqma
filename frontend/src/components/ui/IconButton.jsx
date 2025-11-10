import { Icon } from '@/utils/iconRegistry'

/**
 * IconButton component for icon-only buttons with consistent styling.
 * Ensures proper touch targets (44x44px minimum on mobile).
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon name from icon registry
 * @param {string} props.ariaLabel - Accessibility label (required for screen readers)
 * @param {'ghost'|'primary'|'secondary'|'danger'} [props.variant='ghost'] - Button style variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.disabled=false] - Disable button
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='button'] - Button type
 * @param {string} [props.title] - Tooltip text
 */
export function IconButton({
  icon,
  ariaLabel,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  title,
  ...rest
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
    danger: 'text-red-600 hover:text-red-900 hover:bg-red-50 focus:ring-red-300'
  }
  
  // Ensure minimum touch target of 44x44px on mobile, allow smaller on desktop
  const sizeClasses = {
    sm: 'p-1.5 md:p-1',
    md: 'p-2 md:p-1.5',
    lg: 'p-3 md:p-2'
  }
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  // Minimum touch target class for mobile
  const touchTargetClass = 'min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0'
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${touchTargetClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      {...rest}
    >
      <Icon name={icon} className={iconSizeClasses[size]} />
    </button>
  )
}

