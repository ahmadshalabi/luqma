import { Icon } from '@/utils/iconRegistry'

/**
 * HeaderMobileMenuToggle - Mobile menu toggle button.
 * Displays hamburger icon when closed, X icon when open.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether mobile menu is open
 * @param {Function} props.onToggle - Toggle handler
 */
export function HeaderMobileMenuToggle({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      className="md:hidden inline-flex items-center justify-center p-2 text-gray-700 bg-transparent rounded-lg transition-colors hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-label="Toggle navigation menu"
      onClick={onToggle}
    >
      <Icon name={isOpen ? 'xMark' : 'bars'} className="w-6 h-6" />
    </button>
  )
}

