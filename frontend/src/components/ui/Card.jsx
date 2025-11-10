/**
 * Card component for consistent container styling.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {'sm'|'md'|'lg'|'none'} [props.padding='md'] - Padding variant
 * @param {boolean} [props.hover=false] - Enable hover effect
 * @param {boolean} [props.interactive=false] - Enable interactive styling
 * @param {string} [props.as='div'] - HTML element to render
 * @param {string} [props.className] - Additional CSS classes
 */
export function Card({
  children,
  padding = 'md',
  hover = false,
  interactive = false,
  as: Element = 'div',
  className = '',
  ...rest
}) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-150'
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  }
  
  const hoverClass = hover ? 'hover:shadow-md hover:border-gray-300' : ''
  const interactiveClass = interactive ? 'cursor-pointer' : ''
  
  const cardClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${hoverClass}
    ${interactiveClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <Element className={cardClasses} {...rest}>
      {children}
    </Element>
  )
}

