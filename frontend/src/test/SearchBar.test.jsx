import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '@/features/search/SearchBar'

describe('SearchBar', () => {
  it('should render search input', () => {
    render(<SearchBar />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    expect(input).toBeInTheDocument()
  })

  it('should call onSearch with query on submit', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    await user.type(input, 'chicken')
    await user.keyboard('{Enter}')
    
    expect(mockOnSearch).toHaveBeenCalledWith('chicken')
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
  })

  it('should update input value on change', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    await user.type(input, 'pasta')
    
    expect(input.value).toBe('pasta')
  })
})

