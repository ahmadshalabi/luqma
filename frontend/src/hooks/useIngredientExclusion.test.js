import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useIngredientExclusion } from './useIngredientExclusion'
import * as apiClient from '@/services/apiClient'

vi.mock('@/services/apiClient')

describe('useIngredientExclusion', () => {
  const mockRecipeId = 715497

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    // When: Hook is rendered
    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    // Then: Initial state is empty
    expect(result.current.excludedIds).toEqual(new Set())
    expect(result.current.isUpdating).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should toggle ingredient exclusion', () => {
    // Given: Hook is rendered
    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    // When: Ingredient is toggled on
    act(() => {
      result.current.toggleIngredient(123)
    })

    // Then: Ingredient is added to excluded set
    expect(result.current.excludedIds.has(123)).toBe(true)

    // When: Same ingredient is toggled again
    act(() => {
      result.current.toggleIngredient(123)
    })

    // Then: Ingredient is removed from excluded set
    expect(result.current.excludedIds.has(123)).toBe(false)
  })

  it('should toggle multiple ingredients', () => {
    // Given: Hook is rendered
    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    // When: Multiple ingredients are toggled
    act(() => {
      result.current.toggleIngredient(123)
      result.current.toggleIngredient(456)
      result.current.toggleIngredient(789)
    })

    // Then: All ingredients are in excluded set
    expect(result.current.excludedIds.size).toBe(3)
    expect(result.current.excludedIds.has(123)).toBe(true)
    expect(result.current.excludedIds.has(456)).toBe(true)
    expect(result.current.excludedIds.has(789)).toBe(true)
  })

  it('should apply exclusions successfully', async () => {
    // Given: Mock updated recipe
    const mockUpdatedRecipe = {
      id: mockRecipeId,
      title: 'Updated Recipe',
      ingredients: [],
      nutrition: { calories: 400 }
    }

    vi.mocked(apiClient.excludeIngredients).mockResolvedValue(mockUpdatedRecipe)

    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    // Add ingredients to exclude
    act(() => {
      result.current.toggleIngredient(123)
      result.current.toggleIngredient(456)
    })

    // When: Apply exclusions is called
    let updatedRecipe
    await act(async () => {
      updatedRecipe = await result.current.applyExclusions()
    })

    // Then: API is called with correct parameters
    expect(apiClient.excludeIngredients).toHaveBeenCalledWith(mockRecipeId, [123, 456])
    expect(updatedRecipe).toEqual(mockUpdatedRecipe)
    expect(result.current.error).toBe(null)
  })

  it('should set error when applying exclusions with no selections', async () => {
    // Given: Hook with no exclusions
    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    // When: Apply exclusions is called without selecting any ingredients
    let response
    await act(async () => {
      response = await result.current.applyExclusions()
    })

    // Then: Error is set and no API call is made
    expect(result.current.error).toBe('Please select at least one ingredient to exclude.')
    expect(response).toBe(null)
    expect(apiClient.excludeIngredients).not.toHaveBeenCalled()
  })

  it('should handle API error when applying exclusions', async () => {
    // Given: Mock API error
    const errorMessage = 'Failed to exclude ingredients. Please try again.'
    vi.mocked(apiClient.excludeIngredients).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    // Add ingredient to exclude
    act(() => {
      result.current.toggleIngredient(123)
    })

    // When: Apply exclusions fails
    await act(async () => {
      try {
        await result.current.applyExclusions()
      } catch {
        // Expected to throw
      }
    })

    // Wait for state update
    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage)
    })

    // Then: Error is set and isUpdating is false
    expect(result.current.isUpdating).toBe(false)
  })

  it('should reset exclusions and clear errors', () => {
    // Given: Hook with exclusions and error
    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    act(() => {
      result.current.toggleIngredient(123)
      result.current.toggleIngredient(456)
    })

    // Set error manually for testing
    act(() => {
      result.current.applyExclusions() // Will set error due to no exclusions
    })

    // When: Reset is called
    act(() => {
      result.current.reset()
    })

    // Then: All state is cleared
    expect(result.current.excludedIds.size).toBe(0)
    expect(result.current.error).toBe(null)
  })

  it('should clear error when toggling ingredient after error', () => {
    // Given: Hook with error
    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    act(async () => {
      await result.current.applyExclusions() // Will set error
    })

    expect(result.current.error).not.toBe(null)

    // When: Ingredient is toggled
    act(() => {
      result.current.toggleIngredient(123)
    })

    // Then: Error is cleared
    expect(result.current.error).toBe(null)
  })

  it('should set isUpdating during API call', async () => {
    // Given: Mock delayed API response
    vi.mocked(apiClient.excludeIngredients).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ id: mockRecipeId }), 100))
    )

    const { result } = renderHook(() => useIngredientExclusion(mockRecipeId))

    act(() => {
      result.current.toggleIngredient(123)
    })

    // When: Apply exclusions is called
    act(() => {
      result.current.applyExclusions()
    })

    // Then: isUpdating is true during call
    expect(result.current.isUpdating).toBe(true)

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isUpdating).toBe(false)
    })
  })
})

