import { useMemo } from 'react'

/**
 * Custom hook for managing pagination logic.
 * 
 * Handles page calculations, item slicing, and display ranges for paginated data.
 * Does not manage page state - component should handle currentPage state/URL params.
 * 
 * @param {Object} options - Pagination options
 * @param {Array} options.items - Full array of items to paginate
 * @param {number} options.currentPage - Current page number (1-indexed)
 * @param {number} options.itemsPerPage - Number of items to show per page
 * @returns {Object} Pagination data
 * @returns {Array} returns.paginatedItems - Items for the current page
 * @returns {number} returns.totalPages - Total number of pages
 * @returns {number} returns.validPage - Valid page number (clamped to valid range)
 * @returns {number} returns.startItem - Index of first item on page (1-indexed, 0 if no items)
 * @returns {number} returns.endItem - Index of last item on page (1-indexed)
 * @returns {boolean} returns.hasNextPage - Whether there is a next page
 * @returns {boolean} returns.hasPreviousPage - Whether there is a previous page
 * 
 * @example
 * const { paginatedItems, totalPages, startItem, endItem } = usePagination({
 *   items: recipes,
 *   currentPage: 2,
 *   itemsPerPage: 12
 * })
 * 
 * <div>Showing {startItem}-{endItem} of {recipes.length}</div>
 * <RecipeGrid recipes={paginatedItems} />
 */
export function usePagination({ items = [], currentPage = 1, itemsPerPage = 10 }) {
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage))
  }, [items.length, itemsPerPage])

  // Clamp current page to valid range
  const validPage = useMemo(() => {
    return Math.min(Math.max(1, currentPage), totalPages)
  }, [currentPage, totalPages])

  // Slice items for current page
  const paginatedItems = useMemo(() => {
    const startIndex = (validPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, validPage, itemsPerPage])

  // Calculate display range
  const startItem = useMemo(() => {
    return items.length > 0 ? (validPage - 1) * itemsPerPage + 1 : 0
  }, [items.length, validPage, itemsPerPage])

  const endItem = useMemo(() => {
    return Math.min(validPage * itemsPerPage, items.length)
  }, [validPage, itemsPerPage, items.length])

  // Navigation helpers
  const hasNextPage = validPage < totalPages
  const hasPreviousPage = validPage > 1

  return {
    paginatedItems,
    totalPages,
    validPage,
    startItem,
    endItem,
    hasNextPage,
    hasPreviousPage
  }
}

