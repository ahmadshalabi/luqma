import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMobileMenu } from '@/hooks/useMobileMenu'

describe('useMobileMenu', () => {
  it('should initialize with menu closed', () => {
    const { result } = renderHook(() => useMobileMenu())
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should toggle, open, and close menu', () => {
    const { result } = renderHook(() => useMobileMenu())
    
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)
    
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
    
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
    
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })
})

