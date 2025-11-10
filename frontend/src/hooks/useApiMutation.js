import { useState, useCallback } from 'react'
import { logger } from '@/utils/logger'

/**
 * Custom hook for handling async API mutations with loading and error states.
 * Provides consistent error handling and state management.
 * 
 * @param {Function} mutationFn - Async function to execute
 * @returns {Object} Mutation state and execute function
 *   - isLoading: boolean indicating if mutation is in progress
 *   - error: error message string or null
 *   - execute: function to trigger the mutation
 *   - reset: function to reset error state
 */
export function useApiMutation(mutationFn) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await mutationFn(...args)
      return result
    } catch (err) {
      const errorMessage = err.message || 'An error occurred. Please try again.'
      setError(errorMessage)
      logger.error('API mutation error', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [mutationFn])

  const reset = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    execute,
    reset
  }
}

