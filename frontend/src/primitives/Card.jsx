import { memo } from 'react'

/**
 * Card Component
 * 
 * Base card component providing consistent styling for card layouts.
 * Supports different padding variants, hover effects, and flexible element rendering.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.padding - Padding variant (none, sm, md, lg)
 * @param {boolean} props.hover - Enable hover effects (shadow and scale)
 * @param {boolean} props.interactive - Enable focus and interactive states
 * @param {string} props.as - HTML element to render (div, article, section)
 */
const CardComponent = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  interactive = false,
  as: Element = 'div',
  ...rest
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const baseClasses = 'bg-white border border-gray-200 rounded-lg shadow-sm'
  const paddingClass = padding in paddingClasses ? paddingClasses[padding] : paddingClasses.md
  const hoverClasses = hover ? 'transition-all hover:shadow-md hover:scale-105' : ''
  const interactiveClasses = interactive ? 'focus-within:ring-2 focus-within:ring-blue-500' : ''

  const classes = `${baseClasses} ${paddingClass} ${hoverClasses} ${interactiveClasses} ${className}`.trim()

  return (
    <Element className={classes} {...rest}>
      {children}
    </Element>
  )
}

export const Card = memo(CardComponent)

