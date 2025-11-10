import { useMemo } from 'react'

/**
 * Custom hook for pagination calculations.
 * Generates page numbers with ellipsis for large page counts.
 * 
 * @param {Object} options - Hook options
 * @param {number} options.currentPage - Current page number (1-indexed)
 * @param {number} options.totalPages - Total number of pages
 * @param {number} [options.maxVisible=7] - Maximum visible page buttons
 * @returns {Array} Array of page numbers and ellipsis markers
 */
export function usePaginationLogic({ currentPage, totalPages, maxVisible = 7 }) {
  return useMemo(() => {
    if (totalPages <= 1) {
      return []
    }

    const pages = []

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
  }, [currentPage, totalPages, maxVisible])
}

