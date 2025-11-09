import { memo } from 'react'
import { Icon } from '@/utils/iconRegistry'

/**
 * RecipeMetadataBadge component for displaying recipe metadata with icon.
 * Supports both mobile (solid background) and desktop (transparent overlay) styles.
 * 
 * @param {Object} props - Component props
 * @param {string} props.icon - Icon name from icon registry
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} [props.variant='mobile'] - Style variant ('mobile' or 'desktop')
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} RecipeMetadataBadge component
 */
function RecipeMetadataBadgeComponent({ icon, children, variant = 'mobile', className = '' }) {
  const variantClasses = {
    mobile: 'bg-gray-100 text-gray-700',
    desktop: 'bg-white/20 backdrop-blur-sm text-white'
  }
  
  const iconColorClass = variant === 'mobile' ? 'text-gray-600' : 'text-white'
  const baseClasses = variantClasses[variant] || variantClasses.mobile
  
  return (
    <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${baseClasses} ${className}`.trim()}>
      <Icon name={icon} className={`w-4 h-4 ${iconColorClass}`} aria-hidden="true" />
      <span className="font-medium">{children}</span>
    </div>
  )
}

export const RecipeMetadataBadge = memo(RecipeMetadataBadgeComponent)

