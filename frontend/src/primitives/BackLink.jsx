import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/utils/iconRegistry'

/**
 * BackLink component for consistent back navigation.
 * Displays a link with a back arrow icon.
 * 
 * @param {Object} props - Component props
 * @param {string} props.to - Destination path
 * @param {string} [props.children='Back'] - Link text
 * @param {Object} [props.state] - React Router state to pass
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} BackLink component
 */
function BackLinkComponent({ to, children = 'Back', state, className = '' }) {
  return (
    <Link
      to={to}
      state={state}
      className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded ${className}`.trim()}
    >
      <Icon name="arrowLeft" className="w-5 h-5" aria-hidden="true" />
      <span>{children}</span>
    </Link>
  )
}

export const BackLink = memo(BackLinkComponent)

