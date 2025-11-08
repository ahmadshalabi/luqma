import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearch } from '@/hooks/useSearch'

describe('useSearch', () => {
  it('should initialize with query', () => {
    const { result } = renderHook(() => useSearch({ initialQuery: 'pasta' }))
    
    expect(result.current.query).toBe('pasta')
  })

  it('should update query on change', () => {
    const { result } = renderHook(() => useSearch())
    
    act(() => result.current.handleChange({ target: { value: 'chicken' } }))
    
    expect(result.current.query).toBe('chicken')
  })

  it('should call onSubmit with trimmed query', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useSearch({ onSubmit }))
    
    act(() => result.current.setQuery('  pasta  '))
    act(() => result.current.handleSubmit({ preventDefault: vi.fn() }))
    
    expect(onSubmit).toHaveBeenCalledWith('pasta')
  })

  it('should not submit empty or whitespace queries', () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useSearch({ onSubmit }))
    
    act(() => result.current.handleSubmit({ preventDefault: vi.fn() }))
    expect(onSubmit).not.toHaveBeenCalled()
    
    act(() => result.current.setQuery('   '))
    act(() => result.current.handleSubmit({ preventDefault: vi.fn() }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should clear query', () => {
    const { result } = renderHook(() => useSearch({ initialQuery: 'pasta' }))
    
    act(() => result.current.clear())
    
    expect(result.current.query).toBe('')
  })
})

