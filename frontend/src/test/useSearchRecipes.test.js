import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSearchRecipes } from '@/hooks/useSearchRecipes'
import * as apiClient from '@/services/apiClient'

vi.mock('@/services/apiClient')

describe('useSearchRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch recipes successfully', async () => {
    const mockData = {
      results: [{ id: 1, title: 'Pasta', image: 'pasta.jpg' }],
      totalResults: 1
    }
    
    vi.mocked(apiClient.searchRecipes).mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useSearchRecipes({
      query: 'pasta',
      page: 1,
      pageSize: 9
    }))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.recipes).toEqual(mockData.results)
    expect(result.current.error).toBe(null)
  })

  it('should return empty results when query is empty', () => {
    const { result } = renderHook(() => useSearchRecipes({
      query: '',
      page: 1,
      pageSize: 9
    }))
    
    expect(result.current.recipes).toEqual([])
    expect(apiClient.searchRecipes).not.toHaveBeenCalled()
  })

  it('should handle API errors', async () => {
    vi.mocked(apiClient.searchRecipes).mockRejectedValue(new Error('Failed'))
    
    const { result } = renderHook(() => useSearchRecipes({
      query: 'pasta',
      page: 1,
      pageSize: 9
    }))
    
    await waitFor(() => {
      expect(result.current.error).toBe('Failed')
    })
  })
})

