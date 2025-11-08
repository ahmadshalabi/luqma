import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '@/features/search/SearchBar'

describe('SearchBar', () => {
  it('calls onSearch with query on submit', async () => {
    const user = userEvent.setup()
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    await user.type(input, 'chicken')
    await user.keyboard('{Enter}')
    
    expect(mockOnSearch).toHaveBeenCalledWith('chicken')
  })

  it('calls onChange with query after debounce', async () => {
    const mockOnChange = vi.fn()
    const user = userEvent.setup()
    
    render(<SearchBar onChange={mockOnChange} debounceMs={50} />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    await user.type(input, 'pasta')
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('pasta')
    }, { timeout: 200 })
  })

  it('updates input when initialQuery changes', () => {
    const { rerender } = render(<SearchBar initialQuery="pasta" />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    expect(input).toHaveValue('pasta')
    
    // Simulate URL change (browser navigation)
    rerender(<SearchBar initialQuery="chicken" />)
    expect(input).toHaveValue('chicken')
  })
})

