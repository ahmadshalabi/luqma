import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFocusTrap, useKeyboardShortcuts } from '@/hooks/useKeyboardNavigation'

/**
 * HeaderMobileMenu component - Mobile navigation menu with focus trap.
 * 
 * @param {Object} props
 * @param {Array} props.links - Navigation links array [{to, label}]
 * @param {Function} props.onClose - Close menu handler
 */
export function HeaderMobileMenu({ links, onClose }) {
  const menuRef = useRef(null)
  
  // Add focus trap when menu is open
  useFocusTrap(menuRef, true)
  
  // Close menu on Escape key
  useKeyboardShortcuts({
    'Escape': onClose
  })

  return (
    <nav
      ref={menuRef}
      id="mobile-menu"
      className="md:hidden border-t border-gray-200 py-4"
      aria-label="Mobile navigation"
    >
      <div className="flex flex-col space-y-2">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

