import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Pagination } from '@/components/search/Pagination'

describe('Pagination', () => {
  it('renders accessible navigation with prev/next buttons', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />)
    
    expect(screen.getByRole('navigation', { name: 'Pagination navigation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument()
  })

  it('disables buttons at boundaries', () => {
    const { rerender } = render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
    
    rerender(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled()
  })

  it('handles page navigation', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    render(<Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} />)
    
    await user.click(screen.getByRole('button', { name: 'Go to previous page' }))
    expect(handlePageChange).toHaveBeenCalledWith(1)
    
    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(handlePageChange).toHaveBeenCalledWith(3)
  })
})

