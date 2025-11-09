import { useState, useCallback } from 'react'

/**
 * Custom hook for handling image loading errors with fallback support.
 * 
 * Provides state management for image errors and a handler function that:
 * - Prevents infinite error loops
 * - Falls back to a default image
 * - Updates error state for conditional rendering
 * 
 * @param {string} fallbackSrc - Fallback image URL (default: '/vite.svg')
 * @returns {Object} Image state and handlers
 * @returns {boolean} returns.imageError - Whether image failed to load
 * @returns {Function} returns.handleImageError - Error handler for img onError prop
 * @returns {Function} returns.resetError - Reset error state
 * 
 * @example
 * const { imageError, handleImageError } = useImageFallback()
 * 
 * <img 
 *   src={recipe.image} 
 *   alt={recipe.title}
 *   onError={handleImageError}
 * />
 */
export function useImageFallback(fallbackSrc = '/vite.svg') {
  const [imageError, setImageError] = useState(false)
  
  const handleImageError = useCallback((e) => {
    if (e.target.src !== fallbackSrc) {
      e.target.onerror = null
      e.target.src = fallbackSrc
      setImageError(true)
    }
  }, [fallbackSrc])
  
  const resetError = useCallback(() => {
    setImageError(false)
  }, [])
  
  return {
    imageError,
    handleImageError,
    resetError
  }
}

