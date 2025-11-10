import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useImageFallback } from '@/hooks/useImageFallback'

describe('useImageFallback', () => {
  it('should handle image errors with fallback', () => {
    const fallbackSrc = '/vite.svg'
    const { result } = renderHook(() => useImageFallback(fallbackSrc))
    
    const mockEvent = {
      target: { src: 'https://example.com/broken.jpg', onerror: null }
    }
    
    act(() => {
      result.current.handleImageError(mockEvent)
    })
    
    expect(result.current.imageError).toBe(true)
    expect(mockEvent.target.src).toBe(fallbackSrc)
  })

  it('should not trigger on fallback image error', () => {
    const fallbackSrc = '/vite.svg'
    const { result } = renderHook(() => useImageFallback(fallbackSrc))
    
    const mockEvent = {
      target: { src: fallbackSrc, onerror: null }
    }
    
    act(() => {
      result.current.handleImageError(mockEvent)
    })
    
    expect(result.current.imageError).toBe(false)
  })
})

