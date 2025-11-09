import { useState, useEffect, useCallback, useRef } from 'react'
import { getRecipeById } from '@/services/apiClient'

/**
 * Custom hook for fetching and managing recipe details.
 * Follows React 19 best practices with proper state management and error handling.
 * 
 * @param {string|number} id - Recipe ID to fetch
 * @returns {Object} Hook state object
 * @returns {Object|null} recipe - Recipe data object or null
 * @returns {boolean} loading - Loading state indicator
 * @returns {string|null} error - Error message or null
 * @returns {Function} retry - Function to retry fetching the recipe
 * 
 * @example
 * const { recipe, loading, error, retry } = useRecipeDetail(id)
 * 
 * if (loading) return <LoadingSpinner />
 * if (error) return <ErrorState message={error} onRetry={retry} />
 * if (!recipe) return null
 * 
 * return <RecipeDetail recipe={recipe} />
 */
export function useRecipeDetail(id) {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)
  
  const fetchRecipe = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await getRecipeById(id)
      setRecipe(data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load recipe. Please try again.')
        setRecipe(null)
      }
    } finally {
      setLoading(false)
    }
  }, [id])
  
  useEffect(() => {
    fetchRecipe()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchRecipe])
  
  return {
    recipe,
    loading,
    error,
    retry: fetchRecipe
  }
}

