import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useRecipeDetail } from '../hooks/useRecipeDetail'
import * as apiClient from '@/services/apiClient'

vi.mock('@/services/apiClient')

describe('useRecipeDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch recipe data successfully', async () => {
    // Given: Mock recipe data
    const mockRecipe = {
      id: 715497,
      title: 'Chicken Pasta Alfredo',
      image: 'https://example.com/image.jpg',
      ingredients: [],
      nutrition: {},
      instructions: []
    }
    
    vi.mocked(apiClient.getRecipeById).mockResolvedValue(mockRecipe)
    
    // When: Hook is rendered with recipe ID
    const { result } = renderHook(() => useRecipeDetail(715497))
    
    // Then: Loading state is initially true
    expect(result.current.loading).toBe(true)
    expect(result.current.recipe).toBe(null)
    expect(result.current.error).toBe(null)
    
    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    // Then: Recipe data is set
    expect(result.current.recipe).toEqual(mockRecipe)
    expect(result.current.error).toBe(null)
    expect(apiClient.getRecipeById).toHaveBeenCalledWith(715497)
  })

  it('should handle fetch error', async () => {
    // Given: Mock API error
    const errorMessage = 'Recipe not found. Please try another recipe.'
    vi.mocked(apiClient.getRecipeById).mockRejectedValue(new Error(errorMessage))
    
    // When: Hook is rendered with invalid ID
    const { result } = renderHook(() => useRecipeDetail(999999))
    
    // Wait for error
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    // Then: Error is set and recipe is null
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.recipe).toBe(null)
  })

  it('should not fetch when id is null', async () => {
    // When: Hook is rendered without ID
    const { result } = renderHook(() => useRecipeDetail(null))
    
    // Wait briefly
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    // Then: No API call is made
    expect(apiClient.getRecipeById).not.toHaveBeenCalled()
    expect(result.current.recipe).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should provide retry function', async () => {
    // Given: Initial error
    vi.mocked(apiClient.getRecipeById).mockRejectedValueOnce(new Error('Network error'))
    
    const { result } = renderHook(() => useRecipeDetail(715497))
    
    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
    })
    
    // When: Retry is called with successful response
    const mockRecipe = { id: 715497, title: 'Recipe' }
    vi.mocked(apiClient.getRecipeById).mockResolvedValue(mockRecipe)
    
    result.current.retry()
    
    // Then: Data is fetched successfully
    await waitFor(() => {
      expect(result.current.recipe).toEqual(mockRecipe)
      expect(result.current.error).toBe(null)
    })
  })
})

