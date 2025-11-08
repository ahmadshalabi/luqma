import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePagination } from '@/hooks/usePagination'

describe('usePagination', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))

  it('should paginate items correctly', () => {
    const { result } = renderHook(() => 
      usePagination({ items, currentPage: 2, itemsPerPage: 10 })
    )
    
    expect(result.current.paginatedItems).toHaveLength(10)
    expect(result.current.paginatedItems[0].id).toBe(11)
    expect(result.current.totalPages).toBe(3)
  })

  it('should calculate display range', () => {
    const { result } = renderHook(() => 
      usePagination({ items, currentPage: 2, itemsPerPage: 10 })
    )
    
    expect(result.current.startItem).toBe(11)
    expect(result.current.endItem).toBe(20)
  })

  it('should clamp invalid page numbers', () => {
    const { result } = renderHook(() => 
      usePagination({ items, currentPage: 999, itemsPerPage: 10 })
    )
    
    expect(result.current.validPage).toBe(3)
  })

  it('should indicate navigation availability', () => {
    const { result } = renderHook(() => 
      usePagination({ items, currentPage: 2, itemsPerPage: 10 })
    )
    
    expect(result.current.hasPreviousPage).toBe(true)
    expect(result.current.hasNextPage).toBe(true)
  })
})

