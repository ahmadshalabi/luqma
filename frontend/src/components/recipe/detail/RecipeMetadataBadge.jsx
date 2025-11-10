import { Icon } from '@/utils/iconRegistry'

/**
 * RecipeMetadataBadge component for displaying recipe metadata.
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon name
 * @param {'mobile'|'desktop'} [props.variant='mobile'] - Badge variant
 * @param {React.ReactNode} props.children - Badge content
 */
export function RecipeMetadataBadge({ icon, variant = 'mobile', children }) {
  const baseClasses = 'inline-flex items-center gap-2 rounded-full font-medium transition-colors'
  
  const variantClasses = {
    mobile: 'px-4 py-2 bg-white/95 text-gray-900 backdrop-blur-sm text-base shadow-lg',
    desktop: 'px-4 py-2 bg-white/10 text-white backdrop-blur-md text-sm'
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      <Icon name={icon} className="w-5 h-5" aria-hidden="true" />
      <span>{children}</span>
    </span>
  )
}

