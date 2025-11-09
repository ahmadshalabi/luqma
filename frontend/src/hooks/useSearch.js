import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Custom hook for managing search form state and submission with debounce support.
 * 
 * Provides search query state and handlers for input changes and form submission.
 * The submit handler validates the query (non-empty, trimmed) before calling the callback.
 * Supports live search with debouncing for onChange events.
 * 
 * @param {Object} options - Hook options
 * @param {string} options.initialQuery - Initial search query value
 * @param {Function} options.onSubmit - Callback function called with trimmed query on submit
 * @param {Function} options.onChange - Callback function called with query on change (debounced)
 * @param {number} options.debounceMs - Debounce delay in milliseconds (default: 300)
 * @returns {Object} Search state and handlers
 * @returns {string} returns.query - Current search query value
 * @returns {Function} returns.setQuery - Set query value directly
 * @returns {Function} returns.handleChange - Input change handler
 * @returns {Function} returns.handleSubmit - Form submit handler
 * @returns {Function} returns.clear - Clear the search query
 * 
 * @example
 * const { query, handleChange, handleSubmit } = useSearch({
 *   onSubmit: (searchQuery) => navigate(`/search?q=${searchQuery}`),
 *   onChange: (searchQuery) => performLiveSearch(searchQuery),
 *   debounceMs: 300
 * })
 * 
 * <form onSubmit={handleSubmit}>
 *   <input value={query} onChange={handleChange} />
 * </form>
 */
export function useSearch({ initialQuery = '', onSubmit, onChange, debounceMs = 300 } = {}) {
  const [query, setQuery] = useState(initialQuery)
  const debounceTimerRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const onSubmitRef = useRef(onSubmit)
  const previousQueryRef = useRef(initialQuery)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onSubmitRef.current = onSubmit
  }, [onSubmit])

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (!onChangeRef.current) return

    if (query === previousQueryRef.current) return

    previousQueryRef.current = query

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onChangeRef.current(query)
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, debounceMs])

  const handleChange = useCallback((e) => {
    setQuery(e.target.value)
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (onSubmitRef.current && trimmedQuery) {
      onSubmitRef.current(trimmedQuery)
    }
  }, [query])

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

