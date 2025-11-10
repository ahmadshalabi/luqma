import { Link } from 'react-router-dom'
import { Icon } from '@/utils/iconRegistry'

/**
 * BackLink component for navigation back to previous page.
 * 
 * @param {Object} props
 * @param {string} props.to - Link destination
 * @param {React.ReactNode} props.children - Link text
 * @param {string} [props.className] - Additional CSS classes
 */
export function BackLink({ to, children, className = '' }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded ${className}`}
    >
      <Icon name="chevronLeft" className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  )
}

