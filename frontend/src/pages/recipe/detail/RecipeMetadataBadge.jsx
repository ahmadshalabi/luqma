import { Badge } from '@/components/ui/Badge'

/**
 * RecipeMetadataBadge component for displaying recipe metadata.
 * Uses the unified Badge component with recipe-specific variants.
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon name
 * @param {'mobile'|'desktop'} [props.variant='mobile'] - Badge variant
 * @param {React.ReactNode} props.children - Badge content
 */
export function RecipeMetadataBadge({ icon, variant = 'mobile', children }) {
  const badgeVariant = variant === 'mobile' ? 'white' : 'whiteGlass'
  const size = variant === 'mobile' ? 'lg' : 'md'
  
  return (
    <Badge
      variant={badgeVariant}
      size={size}
      shape="pill"
      icon={icon}
    >
      {children}
    </Badge>
  )
}

