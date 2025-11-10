import { Icon } from '@/utils/iconRegistry'

/**
 * Badge component for displaying labels, counts, and status indicators.
 * Consolidates CountBadge and badge patterns from across the codebase.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content (text or number)
 * @param {number} [props.count] - Numerical count (alternative to children)
 * @param {'default'|'primary'|'success'|'warning'|'danger'|'info'|'white'|'whiteGlass'} [props.variant='default'] - Badge style variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Badge size
 * @param {'pill'|'rounded'|'circle'} [props.shape='pill'] - Badge shape
 * @param {string} [props.icon] - Icon name from icon registry
 * @param {boolean} [props.pulse=false] - Enable pulse animation
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.ariaLabel] - Accessibility label
 */
export function Badge({
  children,
  count,
  variant = 'default',
  size = 'md',
  shape = 'pill',
  icon,
  pulse = false,
  className = '',
  ariaLabel,
  ...rest
}) {
  // Use count if provided, otherwise use children
  const content = count !== undefined ? count : children

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150'
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
    primary: 'bg-blue-600 text-white border border-blue-600',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-400',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    white: 'bg-white/95 text-gray-900 backdrop-blur-sm shadow-lg border border-gray-200',
    whiteGlass: 'bg-white/10 text-white backdrop-blur-md border border-white/20'
  }
  
  const sizeClasses = {
    sm: shape === 'circle' ? 'w-5 h-5 text-xs' : 'px-2 py-0.5 text-xs gap-1',
    md: shape === 'circle' ? 'w-6 h-6 text-sm' : 'px-3 py-1 text-sm gap-1.5',
    lg: shape === 'circle' ? 'w-8 h-8 text-base' : 'px-4 py-2 text-base gap-2'
  }
  
  const shapeClasses = {
    pill: 'rounded-full',
    rounded: 'rounded-lg',
    circle: 'rounded-full'
  }
  
  const pulseClass = pulse ? 'animate-pulse' : ''
  
  // For circle shape with count, ensure proper sizing
  const circleClass = shape === 'circle' ? 'flex-shrink-0' : ''
  
  const badgeClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${shapeClasses[shape]}
    ${pulseClass}
    ${circleClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  // Determine aria-label
  const label = ariaLabel || (count !== undefined ? `Count: ${count}` : undefined)
  
  return (
    <span 
      className={badgeClasses}
      aria-label={label}
      role={count !== undefined ? 'status' : undefined}
      {...rest}
    >
      {icon && (
        <Icon 
          name={icon} 
          className={shape === 'circle' ? 'w-4 h-4' : size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} 
          aria-hidden="true"
        />
      )}
      {content && <span>{content}</span>}
    </span>
  )
}

