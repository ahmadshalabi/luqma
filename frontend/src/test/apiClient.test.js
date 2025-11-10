/* global global */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { searchRecipes } from '@/services/apiClient'

describe('apiClient - searchRecipes', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return data on successful response', async () => {
    const mockData = {
      results: [{ id: 1, title: 'Pasta', image: 'pasta.jpg' }],
      page: 1,
      pageSize: 9,
      totalResults: 1
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const result = await searchRecipes({ query: 'pasta' })

    expect(result).toEqual(mockData)
  })

  it('should throw error when query is empty', async () => {
    await expect(searchRecipes({ query: '' })).rejects.toThrow('Search query is required')
  })

  it('should throw error on HTTP error response', async () => {
    // Mock needs to fail for all retry attempts (initial + 3 retries = 4 total)
    const errorResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Server error' })
    }
    
    global.fetch.mockResolvedValue(errorResponse)

    await expect(searchRecipes({ query: 'test' })).rejects.toThrow('Server error')
  }, 10000) // Increase timeout due to retry delays

  it('should throw user-friendly message on network failure', async () => {
    // Mock needs to fail for all retry attempts (initial + 3 retries = 4 total)
    global.fetch.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(searchRecipes({ query: 'test' })).rejects.toThrow(
      'We\'re having trouble connecting right now. Please check your internet connection and try again.'
    )
  }, 10000) // Increase timeout due to retry delays
})

