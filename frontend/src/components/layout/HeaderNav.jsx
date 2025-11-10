import { Link } from 'react-router-dom'

/**
 * HeaderNav component - Desktop navigation links.
 * 
 * @param {Object} props
 * @param {Array} props.links - Navigation links array [{to, label}]
 */
export function HeaderNav({ links }) {
  return (
    <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className="px-2 py-1 text-base font-medium text-gray-700 rounded transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

