import { useSearchParams } from 'react-router-dom'

/**
 * Custom hook for managing search-related URL parameters.
 * Centralizes search query and pagination state management.
 * 
 * @returns {Object} Search state and setters
 * @returns {string} query - Current search query from URL params
 * @returns {number} page - Current page number (1-indexed)
 * @returns {string} rawPage - Raw page parameter string
 * @returns {Function} setSearchParams - Function to update search params
 * @returns {Function} updateSearch - Helper to update query and page together
 * 
 * @example
 * const { query, page, updateSearch } = useSearchState()
 * 
 * // Update search query and reset to page 1
 * updateSearch('pasta')
 * 
 * // Update search query and specific page
 * updateSearch('pasta', 3)
 */
export function useSearchState() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const query = searchParams.get('q') || ''
  
  const rawPage = searchParams.get('page') || '1'
  const parsedPage = parseInt(rawPage, 10)
  const page = (!isNaN(parsedPage) && parsedPage > 0) ? parsedPage : 1
  
  const updateSearch = (newQuery, newPage = 1) => {
    if (newQuery && newQuery.trim()) {
      setSearchParams({ q: newQuery.trim(), page: newPage.toString() })
    } else {
      setSearchParams({})
    }
  }
  
  const updatePage = (newPage) => {
    if (query) {
      setSearchParams({ q: query, page: newPage.toString() })
    }
  }
  
  const clearSearch = () => {
    setSearchParams({})
  }
  
  return {
    query,
    page,
    rawPage,
    searchParams,
    setSearchParams,
    updateSearch,
    updatePage,
    clearSearch
  }
}

