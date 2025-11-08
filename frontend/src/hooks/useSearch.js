import { useState, useCallback } from 'react'

/**
 * Custom hook for managing search form state and submission.
 * 
 * Provides search query state and handlers for input changes and form submission.
 * The submit handler validates the query (non-empty, trimmed) before calling the callback.
 * 
 * @param {Object} options - Hook options
 * @param {string} options.initialQuery - Initial search query value
 * @param {Function} options.onSubmit - Callback function called with trimmed query on submit
 * @returns {Object} Search state and handlers
 * @returns {string} returns.query - Current search query value
 * @returns {Function} returns.setQuery - Set query value directly
 * @returns {Function} returns.handleChange - Input change handler
 * @returns {Function} returns.handleSubmit - Form submit handler
 * @returns {Function} returns.clear - Clear the search query
 * 
 * @example
 * const { query, handleChange, handleSubmit } = useSearch({
 *   onSubmit: (searchQuery) => navigate(`/search?q=${searchQuery}`)
 * })
 * 
 * <form onSubmit={handleSubmit}>
 *   <input value={query} onChange={handleChange} />
 * </form>
 */
export function useSearch({ initialQuery = '', onSubmit } = {}) {
  const [query, setQuery] = useState(initialQuery)

  const handleChange = useCallback((e) => {
    setQuery(e.target.value)
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (onSubmit && trimmedQuery) {
      onSubmit(trimmedQuery)
    }
  }, [onSubmit, query])

  const clear = useCallback(() => {
    setQuery('')
  }, [])

  return {
    query,
    setQuery,
    handleChange,
    handleSubmit,
    clear
  }
}

