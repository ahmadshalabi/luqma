import { forwardRef } from 'react'

/**
 * Container Component
 * 
 * Page-level container with responsive max-width and padding.
 * Use this for top-level page sections that need consistent margins and max-width.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.containerSize - Container max-width (narrow, default, wide, full)
 * @param {string} props.as - HTML element to render (section, div, article)
 * @param {React.Ref} ref - Forwarded ref
 */
export const Container = forwardRef(({
  children,
  className = '',
  containerSize = 'default',
  as: Element = 'section',
  ...rest
}, ref) => {
  const containerClasses = {
    narrow: 'max-w-2xl',
    default: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full'
  }

  const containerClass = containerClasses[containerSize] || containerClasses.default

  return (
    <Element ref={ref} className={`container mx-auto px-4 py-8 md:py-12 ${className}`} {...rest}>
      <div className={`${containerClass} mx-auto`}>
        {children}
      </div>
    </Element>
  )
})

Container.displayName = 'Container'

