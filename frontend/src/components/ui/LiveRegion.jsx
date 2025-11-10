/**
 * LiveRegion Component
 * 
 * Accessible live region for announcing dynamic content changes to screen readers.
 * Follows WCAG 2.1 AA accessibility standards.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to announce
 * @param {'polite'|'assertive'|'off'} [props.priority='polite'] - Announcement priority
 * @param {'status'|'alert'|null} [props.role=null] - ARIA role
 * @param {boolean} [props.atomic=true] - Whether entire region should be announced
 * @param {boolean} [props.visible=false] - Whether content should be visually visible
 * @param {string} [props.className] - Additional CSS classes
 */
export function LiveRegion({
  children,
  priority = 'polite',
  role = null,
  atomic = true,
  visible = false,
  className = ''
}) {
  // If no children, don't render anything
  if (!children) {
    return null
  }

  const baseClasses = visible 
    ? '' 
    : 'sr-only' // Screen reader only

  const combinedClassName = `${baseClasses} ${className}`.trim()

  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      role={role}
      className={combinedClassName}
    >
      {children}
    </div>
  )
}

/**
 * StatusRegion - For status updates (polite announcements)
 */
export function StatusRegion({ children, visible = false, className = '' }) {
  return (
    <LiveRegion
      priority="polite"
      role="status"
      visible={visible}
      className={className}
    >
      {children}
    </LiveRegion>
  )
}

/**
 * AlertRegion - For important alerts (assertive announcements)
 */
export function AlertRegion({ children, visible = true, className = '' }) {
  return (
    <LiveRegion
      priority="assertive"
      role="alert"
      visible={visible}
      className={className}
    >
      {children}
    </LiveRegion>
  )
}

