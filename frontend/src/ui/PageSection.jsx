import { memo } from 'react'

/**
 * PageSection Component
 * 
 * Consistent section wrapper for page content with container sizing options.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.containerSize - Container max-width (narrow, default, wide, full)
 * @param {string} props.as - HTML element to render (section, div, article)
 */
const PageSectionComponent = ({
  children,
  className = '',
  containerSize = 'default',
  as: Element = 'section',
  ...rest
}) => {
  const containerClasses = {
    narrow: 'max-w-2xl',
    default: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full'
  }

  const containerClass = containerClasses[containerSize] || containerClasses.default

  return (
    <Element className={`container mx-auto px-4 py-8 md:py-12 ${className}`} {...rest}>
      <div className={`${containerClass} mx-auto`}>
        {children}
      </div>
    </Element>
  )
}

export const PageSection = memo(PageSectionComponent)

