/**
 * Heading component for consistent heading styles and semantic HTML.
 * Enforces proper document outline while allowing visual flexibility.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Heading content
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} [props.as='h2'] - Semantic HTML heading level
 * @param {'xl'|'lg'|'md'|'sm'} [props.size] - Visual size (defaults based on 'as' prop)
 * @param {'bold'|'semibold'|'medium'} [props.weight='bold'] - Font weight
 * @param {'gray'|'white'|'primary'} [props.color='gray'] - Text color
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.id] - Heading ID for anchor links
 */
export function Heading({
  children,
  as = 'h2',
  size,
  weight = 'bold',
  color = 'gray',
  className = '',
  id,
  ...rest
}) {
  const Element = as
  
  // Default sizes based on semantic level
  const defaultSizes = {
    h1: 'xl',
    h2: 'lg',
    h3: 'md',
    h4: 'sm',
    h5: 'sm',
    h6: 'sm'
  }
  
  const actualSize = size || defaultSizes[as]
  
  const sizeClasses = {
    xl: 'text-3xl md:text-4xl lg:text-5xl',
    lg: 'text-2xl md:text-3xl',
    md: 'text-xl md:text-2xl',
    sm: 'text-lg md:text-xl'
  }
  
  const weightClasses = {
    bold: 'font-bold',
    semibold: 'font-semibold',
    medium: 'font-medium'
  }
  
  const colorClasses = {
    gray: 'text-gray-900',
    white: 'text-white',
    primary: 'text-blue-600'
  }
  
  const headingClasses = `
    ${sizeClasses[actualSize]}
    ${weightClasses[weight]}
    ${colorClasses[color]}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <Element id={id} className={headingClasses} {...rest}>
      {children}
    </Element>
  )
}

