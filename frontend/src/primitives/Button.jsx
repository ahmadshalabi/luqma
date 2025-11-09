import { memo } from 'react'

/**
 * Button component with consistent styling and variants.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'danger'|'ghost'} [props.variant='primary'] - Button style variant
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Button size
 * @param {boolean} [props.fullWidth=false] - Make button full width
 * @param {boolean} [props.disabled=false] - Disable button
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.ariaLabel] - Accessibility label
 * @param {string} [props.type='button'] - Button type
 */
const ButtonComponent = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  ariaLabel,
  type = 'button',
  ...rest
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-4 flex items-center justify-center gap-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 shadow-md hover:shadow-lg disabled:bg-gray-400',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-200 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 shadow-md hover:shadow-lg disabled:bg-gray-400',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-200 disabled:opacity-50',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-base min-h-[40px] md:px-4 md:py-2 md:text-sm md:min-h-[36px]',
    lg: 'px-5 py-3 text-base min-h-[44px] md:px-5 md:py-2.5 md:text-base md:min-h-[40px]',
    xl: 'px-6 py-5 text-xl font-bold rounded-2xl min-h-[56px] md:px-6 md:py-3 md:text-base md:rounded-lg md:min-h-[44px]',
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  const disabledClass = disabled ? 'cursor-not-allowed' : 'active:scale-[0.98]'
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${disabledClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  )
}

export const Button = memo(ButtonComponent)

