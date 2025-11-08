import { useState } from 'react'
import { Link } from 'react-router-dom'

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
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
            className="md:hidden inline-flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
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
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/recipes"
                className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recipes
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
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

