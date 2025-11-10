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
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Server error' })
    })

    await expect(searchRecipes({ query: 'test' })).rejects.toThrow('Server error')
  })

  it('should throw user-friendly message on network failure', async () => {
    global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await expect(searchRecipes({ query: 'test' })).rejects.toThrow(
      'Unable to connect to the server. Please check your connection.'
    )
  })
})

