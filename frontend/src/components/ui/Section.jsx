import { useId } from 'react'

/**
 * Section component for semantic content organization with optional title.
 * Simple wrapper for <section> element with consistent styling.
 *
 * @param {Object} props - Component props
 * @param {string} [props.title] - Section title (renders as h2 if provided)
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.id] - Custom section ID (auto-generated if not provided)
 * @returns {JSX.Element} Section component
 */
export function Section({ title, children, className = '', id }) {
  const autoId = useId()
  const sectionId = id || autoId
  const headingId = `${sectionId}-heading`

  return (
    <section
      id={sectionId}
      className={`space-y-4 ${className}`}
      aria-labelledby={title ? headingId : undefined}
    >
      {title && (
        <h2
          id={headingId}
          className="text-xl font-semibold text-gray-900"
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

