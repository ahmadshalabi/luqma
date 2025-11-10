/**
 * SkipLink - Accessibility skip link for keyboard navigation.
 * Hidden by default, visible on focus for screen readers and keyboard users.
 * 
 * @param {Object} props
 * @param {string} [props.href='#main-content'] - Target element ID
 * @param {string} [props.children='Skip to main content'] - Link text
 */
export function SkipLink({ href = '#main-content', children = 'Skip to main content' }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:text-white focus:bg-blue-600 focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </a>
  )
}

