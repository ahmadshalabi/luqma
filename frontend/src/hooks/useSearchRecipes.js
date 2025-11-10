import { useState, useEffect, useRef } from 'react'
import { searchRecipes } from '@/services/apiClient'

/**
 * Custom hook for searching recipes with pagination.
 * Handles API calls, loading states, and error handling.
 * 
 * @param {Object} options - Hook options
 * @param {string} options.query - Search query
 * @param {number} options.page - Current page (1-indexed)
 * @param {number} options.pageSize - Results per page
 * @returns {Object} Search state and methods
 */
export function useSearchRecipes({ query, page, pageSize }) {
  const [recipes, setRecipes] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState(null)
  const previousQueryRef = useRef('')

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setRecipes([])
      setTotalResults(0)
      setIsInitialLoad(true)
      previousQueryRef.current = ''
      return
    }

    const isNewQuery = query !== previousQueryRef.current
    if (isNewQuery) {
      setIsInitialLoad(true)
      previousQueryRef.current = query
    }

    const fetchRecipes = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await searchRecipes({
          query: query.trim(),
          page,
          pageSize
        })

        setRecipes(data.results || [])
        setTotalResults(data.totalResults || 0)
        setIsInitialLoad(false)
      } catch (err) {
        setError(err.message || 'Failed to load recipes')
        if (isNewQuery) {
          setRecipes([])
          setTotalResults(0)
        }
        setIsInitialLoad(false)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [query, page, pageSize])

  return {
    recipes,
    totalResults,
    loading,
    isInitialLoad,
    error
  }
}

