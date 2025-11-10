import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useRecipeDetail } from '../hooks/useRecipeDetail'
import * as apiClient from '@/services/apiClient'

vi.mock('@/services/apiClient')

describe('useRecipeDetail', () => {
  beforeEach(() => vi.clearAllMocks())

  const mockRecipe = { id: 715497, title: 'Test Recipe', image: 'test.jpg', ingredients: [], nutrition: {}, instructions: [] }

  it('fetches recipe successfully', async () => {
    vi.mocked(apiClient.getRecipeById).mockResolvedValue(mockRecipe)
    const { result } = renderHook(() => useRecipeDetail(715497))
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => expect(result.current.loading).toBe(false))
    
    expect(result.current.recipe).toEqual(mockRecipe)
    expect(result.current.error).toBe(null)
  })

  it('handles fetch error', async () => {
    vi.mocked(apiClient.getRecipeById).mockRejectedValue(new Error('Failed'))
    const { result } = renderHook(() => useRecipeDetail(999))
    
    await waitFor(() => expect(result.current.error).toBe('Failed'))
    expect(result.current.recipe).toBe(null)
  })

  it('skips fetch when id is null', async () => {
    const { result } = renderHook(() => useRecipeDetail(null))
    
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(apiClient.getRecipeById).not.toHaveBeenCalled()
  })

  it('retries after error', async () => {
    vi.mocked(apiClient.getRecipeById).mockRejectedValueOnce(new Error('Error'))
    const { result } = renderHook(() => useRecipeDetail(715497))
    
    await waitFor(() => expect(result.current.error).toBe('Error'))
    
    vi.mocked(apiClient.getRecipeById).mockResolvedValue(mockRecipe)
    await waitFor(async () => result.current.retry())
    
    await waitFor(() => expect(result.current.recipe).toEqual(mockRecipe))
  })
})

