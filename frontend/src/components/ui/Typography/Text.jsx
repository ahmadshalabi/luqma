/**
 * Text component for consistent text styling across the application.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Text content
 * @param {'p'|'span'|'div'|'label'} [props.as='p'] - HTML element to render
 * @param {'xl'|'lg'|'md'|'sm'|'xs'} [props.size='md'] - Text size
 * @param {'body'|'caption'|'label'|'helper'} [props.variant='body'] - Text variant/purpose
 * @param {'gray'|'muted'|'white'|'primary'|'success'|'warning'|'danger'} [props.color='gray'] - Text color
 * @param {'normal'|'medium'|'semibold'|'bold'} [props.weight='normal'] - Font weight
 * @param {boolean} [props.truncate=false] - Truncate with ellipsis
 * @param {string} [props.className] - Additional CSS classes
 */
export function Text({
  children,
  as = 'p',
  size = 'md',
  variant = 'body',
  color = 'gray',
  weight = 'normal',
  truncate = false,
  className = '',
  ...rest
}) {
  const Element = as
  
  const sizeClasses = {
    xl: 'text-xl',
    lg: 'text-lg',
    md: 'text-base',
    sm: 'text-sm',
    xs: 'text-xs'
  }
  
  const variantClasses = {
    body: 'leading-relaxed',
    caption: 'text-sm leading-normal',
    label: 'text-sm font-medium leading-normal',
    helper: 'text-sm leading-normal'
  }
  
  const colorClasses = {
    gray: 'text-gray-900',
    muted: 'text-gray-600',
    white: 'text-white',
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  }
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  const truncateClass = truncate ? 'truncate' : ''
  
  const textClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${colorClasses[color]}
    ${weightClasses[weight]}
    ${truncateClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <Element className={textClasses} {...rest}>
      {children}
    </Element>
  )
}

