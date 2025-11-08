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

  it('should call onChange with debounce', async () => {
    vi.useFakeTimers()
    const onChange = vi.fn()
    const { result } = renderHook(() => useSearch({ onChange, debounceMs: 300 }))
    
    act(() => result.current.setQuery('pasta'))
    
    // Should not call immediately
    expect(onChange).not.toHaveBeenCalled()
    
    // Advance timers and flush promises
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    
    expect(onChange).toHaveBeenCalledWith('pasta')
    
    vi.useRealTimers()
  })

  it('should clear query', () => {
    const { result } = renderHook(() => useSearch({ initialQuery: 'pasta' }))
    
    act(() => result.current.clear())
    
    expect(result.current.query).toBe('')
  })

  it('should use latest onSubmit callback via ref', () => {
    const onSubmit1 = vi.fn()
    const onSubmit2 = vi.fn()
    
    const { result, rerender } = renderHook(
      ({ onSubmit }) => useSearch({ onSubmit }),
      { initialProps: { onSubmit: onSubmit1 } }
    )
    
    act(() => result.current.setQuery('pasta'))
    
    // Change the onSubmit callback
    rerender({ onSubmit: onSubmit2 })
    
    // Submit should use the latest callback
    act(() => result.current.handleSubmit({ preventDefault: vi.fn() }))
    
    expect(onSubmit1).not.toHaveBeenCalled()
    expect(onSubmit2).toHaveBeenCalledWith('pasta')
  })
})

