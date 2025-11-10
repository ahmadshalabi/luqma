import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IconButton } from '@/components/ui/IconButton'

describe('IconButton', () => {
  it('renders with icon and aria-label', () => {
    render(<IconButton icon="close" ariaLabel="Close" />)
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-label', 'Close')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<IconButton icon="close" ariaLabel="Close" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('disables interaction when disabled', () => {
    const onClick = vi.fn()
    render(<IconButton icon="close" ariaLabel="Close" disabled onClick={onClick} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies variant classes', () => {
    const { rerender } = render(<IconButton icon="close" ariaLabel="Close" variant="primary" />)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
    
    rerender(<IconButton icon="close" ariaLabel="Close" variant="danger" />)
    expect(screen.getByRole('button')).toHaveClass('text-red-600')
  })

  it('applies size classes', () => {
    render(<IconButton icon="close" ariaLabel="Close" size="lg" />)
    expect(screen.getByRole('button')).toHaveClass('p-3')
  })

  it('uses custom title or defaults to ariaLabel', () => {
    const { rerender } = render(<IconButton icon="close" ariaLabel="Close" title="Close window" />)
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Close window')
    
    rerender(<IconButton icon="close" ariaLabel="Close" />)
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Close')
  })

  it('supports custom type attribute', () => {
    render(<IconButton icon="search" ariaLabel="Search" type="submit" />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})

