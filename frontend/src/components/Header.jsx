import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/ui/Icon'

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:text-white focus:bg-blue-600 focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 rounded transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Luqma
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            <Link
              to="/"
              className="px-2 py-1 text-base font-medium text-gray-700 rounded transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Home
            </Link>
            <Link
              to="/recipes"
              className="px-2 py-1 text-base font-medium text-gray-700 rounded transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Recipes
            </Link>
            <Link
              to="/about"
              className="px-2 py-1 text-base font-medium text-gray-700 rounded transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 text-gray-700 bg-transparent rounded-lg transition-colors hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <Icon name="close" size="lg" />
            ) : (
              <Icon name="menu" size="lg" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden border-t border-gray-200 py-4"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/recipes"
                className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={closeMobileMenu}
              >
                Recipes
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

