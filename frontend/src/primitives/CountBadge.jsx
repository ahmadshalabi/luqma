import { memo } from 'react'

/**
 * CountBadge component displaying a count in a circular badge.
 * 
 * @param {Object} props
 * @param {number} props.count - Number to display
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Badge size
 * @param {boolean} [props.pulse=false] - Whether to show pulsing animation
 * @param {string} [props.className] - Additional CSS classes
 */
const CountBadgeComponent = ({
  count,
  size = 'md',
  pulse = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-xl md:w-8 md:h-8 md:text-lg',
    lg: 'w-12 h-12 text-2xl md:w-10 md:h-10 md:text-xl',
  }
  
  const pulseClass = pulse ? 'animate-pulse' : ''
  
  const badgeClasses = `
    ${sizeClasses[size]}
    bg-blue-500 rounded-full flex items-center justify-center font-bold text-white
    ${pulseClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <div className={badgeClasses}>
      <span>{count}</span>
    </div>
  )
}

export const CountBadge = memo(CountBadgeComponent)

