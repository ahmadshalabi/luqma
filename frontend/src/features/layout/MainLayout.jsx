import { memo } from 'react'

/**
 * MainLayout component for consistent main content structure.
 * Provides standard container, padding, and sizing patterns.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Main content
 * @param {boolean} [props.withContainer=true] - Whether to use container wrapper
 * @param {boolean} [props.withPadding=true] - Whether to add padding
 * @param {string} [props.maxWidth='full'] - Max width variant (narrow, default, wide, full)
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} MainLayout component
 */
function MainLayoutComponent({ 
  children, 
  withContainer = true,
  withPadding = true,
  maxWidth = 'full',
  className = ''
}) {
  const containerClass = withContainer ? 'container mx-auto' : ''
  const paddingClass = withPadding ? 'px-4 py-8' : ''
  
  const maxWidthClasses = {
    narrow: 'max-w-2xl mx-auto',
    default: 'max-w-4xl mx-auto',
    wide: 'max-w-6xl mx-auto',
    full: ''
  }
  
  const maxWidthClass = maxWidthClasses[maxWidth] || maxWidthClasses.full
  
  return (
    <main id="main-content" className="flex-grow">
      <div className={`${containerClass} ${paddingClass} ${maxWidthClass} ${className}`.trim()}>
        {children}
      </div>
    </main>
  )
}

export const MainLayout = memo(MainLayoutComponent)

