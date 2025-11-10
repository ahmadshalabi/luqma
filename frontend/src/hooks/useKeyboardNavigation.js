import { useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for arrow key navigation in a grid layout.
 * 
 * @param {Object} options
 * @param {number} options.itemCount - Total number of items in grid
 * @param {number} options.columns - Number of columns in grid
 * @param {boolean} [options.enabled=true] - Whether navigation is enabled
 * @param {Function} [options.onItemSelect] - Callback when item is selected (Enter/Space)
 * @returns {Object} Navigation state and handlers
 */
export function useKeyboardNavigation({ itemCount, columns, enabled = true, onItemSelect }) {
  const currentFocusIndex = useRef(0)
  const itemRefs = useRef([])

  // Initialize refs array
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, itemCount)
  }, [itemCount])

  const focusItem = useCallback((index) => {
    if (index >= 0 && index < itemCount && itemRefs.current[index]) {
      itemRefs.current[index].focus()
      currentFocusIndex.current = index
    }
  }, [itemCount])

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return

    const { key } = event
    const currentIndex = currentFocusIndex.current
    let newIndex = currentIndex

    switch (key) {
      case 'ArrowRight':
        event.preventDefault()
        newIndex = Math.min(currentIndex + 1, itemCount - 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        newIndex = Math.max(currentIndex - 1, 0)
        break
      case 'ArrowDown':
        event.preventDefault()
        newIndex = Math.min(currentIndex + columns, itemCount - 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        newIndex = Math.max(currentIndex - columns, 0)
        break
      case 'Home':
        event.preventDefault()
        newIndex = 0
        break
      case 'End':
        event.preventDefault()
        newIndex = itemCount - 1
        break
      case 'Enter':
      case ' ':
        if (onItemSelect) {
          event.preventDefault()
          onItemSelect(currentIndex)
        }
        return
      default:
        return
    }

    if (newIndex !== currentIndex) {
      focusItem(newIndex)
    }
  }, [enabled, itemCount, columns, focusItem, onItemSelect])

  const setItemRef = useCallback((index) => (element) => {
    itemRefs.current[index] = element
  }, [])

  return {
    handleKeyDown,
    setItemRef,
    focusItem
  }
}

/**
 * Custom hook for global keyboard shortcuts.
 * 
 * @param {Object} shortcuts - Map of key combinations to handlers
 * @param {boolean} [enabled=true] - Whether shortcuts are enabled
 * 
 * @example
 * useKeyboardShortcuts({
 *   '/': () => searchInputRef.current?.focus(),
 *   'Escape': () => closeModal()
 * })
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target.tagName === 'INPUT' || 
          event.target.tagName === 'TEXTAREA' ||
          event.target.isContentEditable) {
        // Allow Escape to work everywhere
        if (event.key !== 'Escape') {
          return
        }
      }

      const handler = shortcuts[event.key]
      if (handler) {
        event.preventDefault()
        handler(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}

/**
 * Custom hook for focus trap (e.g., in modals).
 * 
 * @param {React.RefObject} containerRef - Ref to container element
 * @param {boolean} [isActive=false] - Whether focus trap is active
 * @returns {Function} Function to focus first element
 */
export function useFocusTrap(containerRef, isActive = false) {
  const previouslyFocusedElement = useRef(null)

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []
    
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
  }, [containerRef])

  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }, [getFocusableElements])

  useEffect(() => {
    if (!isActive) return

    // Store currently focused element
    previouslyFocusedElement.current = document.activeElement

    // Focus first element
    focusFirstElement()

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Shift + Tab
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      
      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus()
      }
    }
  }, [isActive, getFocusableElements, focusFirstElement])

  return focusFirstElement
}

