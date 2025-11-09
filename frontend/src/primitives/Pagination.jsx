import { memo } from 'react'
import { Icon } from '@/utils/iconRegistry'

/**
 * Pagination Component
 * 
 * Displays page navigation with Previous/Next buttons and page numbers.
 * Implements WCAG 2.1 AA accessibility standards.
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback when page changes (receives new page number)
 * @param {string} props.className - Additional CSS classes
 */
const PaginationComponent = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) {
    return null
  }

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page)
    }
  }

  const handleKeyDown = (e, page) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePageChange(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        end = 4
      }

      if (currentPage >= totalPages - 2) {
        start = totalPages - 3
      }

      if (start > 2) {
        pages.push('ellipsis-start')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) {
        pages.push('ellipsis-end')
      }

      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const baseButtonClasses = 'inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
  const activeClasses = 'bg-blue-600 text-white hover:bg-blue-700'
  const inactiveClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
  const disabledClasses = 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'

  return (
    <nav
      role="navigation"
      aria-label="Pagination navigation"
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className={`${baseButtonClasses} ${
          currentPage === 1 ? disabledClasses : inactiveClasses
        }`}
      >
        <Icon name="chevronLeft" className="w-5 h-5" />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page) => {
          if (typeof page === 'string' && page.startsWith('ellipsis')) {
            return (
              <span
                key={page}
                className="inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              onKeyDown={(e) => handleKeyDown(e, page)}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
              className={`${baseButtonClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className={`${baseButtonClasses} ${
          currentPage === totalPages ? disabledClasses : inactiveClasses
        }`}
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <Icon name="chevronRight" className="w-5 h-5" />
      </button>
    </nav>
  )
}

export const Pagination = memo(PaginationComponent)

