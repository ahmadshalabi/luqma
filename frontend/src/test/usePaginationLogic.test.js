import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePaginationLogic } from '@/hooks/usePaginationLogic'

describe('usePaginationLogic', () => {
  it('should return empty for single page', () => {
    const { result } = renderHook(() => usePaginationLogic({
      currentPage: 1,
      totalPages: 1
    }))
    
    expect(result.current).toEqual([])
  })

  it('should return all pages when few pages', () => {
    const { result } = renderHook(() => usePaginationLogic({
      currentPage: 3,
      totalPages: 5
    }))
    
    expect(result.current).toEqual([1, 2, 3, 4, 5])
  })

  it('should show ellipsis for many pages', () => {
    const { result } = renderHook(() => usePaginationLogic({
      currentPage: 5,
      totalPages: 10
    }))
    
    expect(result.current).toEqual([1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 10])
  })

  it('should handle first and last pages', () => {
    const first = renderHook(() => usePaginationLogic({ currentPage: 1, totalPages: 10 }))
    const last = renderHook(() => usePaginationLogic({ currentPage: 10, totalPages: 10 }))
    
    expect(first.result.current).toEqual([1, 2, 3, 4, 'ellipsis-end', 10])
    expect(last.result.current).toEqual([1, 'ellipsis-start', 7, 8, 9, 10])
  })
})

