import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Pagination } from '@/primitives/Pagination'

describe('Pagination', () => {
  it('should not render when totalPages is 1 or less', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render with accessible navigation', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />)
    
    expect(screen.getByRole('navigation', { name: 'Pagination navigation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument()
  })

  it('should disable buttons at boundaries', () => {
    const { rerender } = render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
    
    rerender(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled()
  })

  it('should handle page navigation', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    render(<Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} />)
    
    await user.click(screen.getByRole('button', { name: 'Go to previous page' }))
    expect(handlePageChange).toHaveBeenCalledWith(1)
    
    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(handlePageChange).toHaveBeenCalledWith(3)
    
    await user.click(screen.getByRole('button', { name: 'Go to page 4' }))
    expect(handlePageChange).toHaveBeenCalledWith(4)
  })

  it('should mark current page with aria-current', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />)
    
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toHaveAttribute('aria-current', 'page')
  })

  it('should show ellipsis for many pages', () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={vi.fn()} />)
    
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 20' })).toBeInTheDocument()
    expect(screen.getAllByText('...').length).toBeGreaterThan(0)
  })
})

