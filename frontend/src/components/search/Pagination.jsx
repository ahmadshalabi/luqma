import { useCallback } from 'react'
import { Icon } from '@/utils/iconRegistry'
import { usePaginationLogic } from '@/hooks/usePaginationLogic'
import { PaginationButton } from './PaginationButton'
import { PaginationEllipsis } from './PaginationEllipsis'

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
export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) {
  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page)
    }
  }, [currentPage, totalPages, onPageChange])

  const handleKeyDown = useCallback((e, page) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePageChange(page)
    }
  }, [handlePageChange])

  const pageNumbers = usePaginationLogic({ currentPage, totalPages })

  if (totalPages <= 1) {
    return null
  }

  const baseButtonClasses = 'inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
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
            return <PaginationEllipsis key={page} id={page} />
          }

          const isActive = page === currentPage

          return (
            <PaginationButton
              key={page}
              page={page}
              isActive={isActive}
              onClick={() => handlePageChange(page)}
              onKeyDown={(e) => handleKeyDown(e, page)}
            />
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

