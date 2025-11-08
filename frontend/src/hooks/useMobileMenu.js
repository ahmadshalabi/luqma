import { useState, useCallback } from 'react'

/**
 * Custom hook for managing mobile menu state.
 * 
 * Provides state and handlers for toggling mobile menu open/closed.
 * Useful for responsive navigation components.
 * 
 * @returns {Object} Mobile menu state and handlers
 * @returns {boolean} returns.isOpen - Whether mobile menu is currently open
 * @returns {Function} returns.toggle - Toggle menu open/closed
 * @returns {Function} returns.open - Open the menu
 * @returns {Function} returns.close - Close the menu
 * 
 * @example
 * const { isOpen, toggle, close } = useMobileMenu()
 * 
 * <button onClick={toggle}>Toggle Menu</button>
 * {isOpen && <nav><Link onClick={close}>Home</Link></nav>}
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    toggle,
    open,
    close
  }
}

