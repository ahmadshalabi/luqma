import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMobileMenu } from '@/hooks/useMobileMenu'

describe('useMobileMenu', () => {
  it('toggles menu state', () => {
    const { result } = renderHook(() => useMobileMenu())
    
    expect(result.current.isOpen).toBe(false)
    
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)
    
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
  })
})

