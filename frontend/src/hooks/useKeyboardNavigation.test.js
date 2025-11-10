import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKeyboardNavigation, useKeyboardShortcuts, useFocusTrap } from './useKeyboardNavigation'

describe('useKeyboardNavigation', () => {
  it('should provide navigation handlers', () => {
    const { result } = renderHook(() => 
      useKeyboardNavigation({ itemCount: 5, columns: 3, enabled: true })
    )

    expect(result.current.handleKeyDown).toBeInstanceOf(Function)
    expect(result.current.setItemRef).toBeInstanceOf(Function)
    expect(result.current.focusItem).toBeInstanceOf(Function)
  })

  it('should handle arrow keys when enabled', () => {
    const { result } = renderHook(() => 
      useKeyboardNavigation({ itemCount: 5, columns: 3, enabled: true })
    )

    const mockEvent = { key: 'ArrowRight', preventDefault: vi.fn() }
    act(() => result.current.handleKeyDown(mockEvent))
    
    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  it('should call onItemSelect on Enter/Space', () => {
    const onItemSelect = vi.fn()
    const { result } = renderHook(() => 
      useKeyboardNavigation({ itemCount: 5, columns: 3, enabled: true, onItemSelect })
    )

    act(() => result.current.handleKeyDown({ key: 'Enter', preventDefault: vi.fn() }))
    expect(onItemSelect).toHaveBeenCalled()
  })
})

describe('useKeyboardShortcuts', () => {
  it('should register and cleanup shortcuts', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useKeyboardShortcuts({ '/': vi.fn() }, true))
    
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    
    addSpy.mockRestore()
    removeSpy.mockRestore()
  })

  it('should not register when disabled', () => {
    const spy = vi.spyOn(window, 'addEventListener')
    renderHook(() => useKeyboardShortcuts({ '/': vi.fn() }, false))
    
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('useFocusTrap', () => {
  it('should return focus function and manage event listeners', () => {
    const ref = { current: document.createElement('div') }
    const addSpy = vi.spyOn(document, 'addEventListener')
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    
    const { result, unmount } = renderHook(() => useFocusTrap(ref, true))
    
    expect(result.current).toBeInstanceOf(Function)
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    
    addSpy.mockRestore()
    removeSpy.mockRestore()
  })
})

