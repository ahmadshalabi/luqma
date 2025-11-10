import { Link } from 'react-router-dom'

/**
 * HeaderLogo component - Brand logo/name link.
 * 
 * @param {Object} props
 * @param {string} [props.text='Luqma'] - Logo text
 */
export function HeaderLogo({ text = 'Luqma' }) {
  return (
    <div className="flex-shrink-0">
      <Link
        to="/"
        className="text-2xl font-bold text-gray-900 rounded transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {text}
      </Link>
    </div>
  )
}

