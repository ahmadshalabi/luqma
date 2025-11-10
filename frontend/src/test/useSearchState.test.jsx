import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useSearchState } from '@/hooks/useSearchState'

const wrapper = ({ children, initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
)

describe('useSearchState', () => {
  it('should read query and page from URL', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: ({ children }) => wrapper({ children, initialEntries: ['/?q=pasta&page=3'] })
    })
    
    expect(result.current.query).toBe('pasta')
    expect(result.current.page).toBe(3)
  })

  it('should default to empty query and page 1', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: ({ children }) => wrapper({ children, initialEntries: ['/'] })
    })
    
    expect(result.current.query).toBe('')
    expect(result.current.page).toBe(1)
  })

  it('should handle invalid page numbers', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: ({ children }) => wrapper({ children, initialEntries: ['/?q=pasta&page=invalid'] })
    })
    
    expect(result.current.page).toBe(1)
  })

  it('should update search params', () => {
    const { result } = renderHook(() => useSearchState(), {
      wrapper: ({ children }) => wrapper({ children, initialEntries: ['/'] })
    })
    
    act(() => {
      result.current.updateSearch('pasta', 2)
    })
    
    expect(result.current.query).toBe('pasta')
    expect(result.current.page).toBe(2)
  })
})

