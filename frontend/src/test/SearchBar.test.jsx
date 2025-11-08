import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../components/SearchBar'

describe('SearchBar', () => {
  it('should render search input', () => {
    render(<SearchBar />)
    const input = screen.getByLabelText(/search for recipes/i)
    expect(input).toBeInTheDocument()
  })

  it('should call onSearch with query on submit', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    fireEvent.change(input, { target: { value: 'chicken' } })
    
    const form = input.closest('form')
    fireEvent.submit(form)
    
    expect(mockOnSearch).toHaveBeenCalledWith('chicken')
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
  })

  it('should not call onSearch when input is empty', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    const form = input.closest('form')
    
    fireEvent.submit(form)
    
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('should not submit when query is empty or whitespace', () => {
    const mockOnSearch = vi.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByLabelText(/search for recipes/i)
    const form = input.closest('form')
    
    // Test empty
    fireEvent.submit(form)
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    // Test whitespace
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(form)
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('should update input value on change', () => {
    render(<SearchBar />)
    const input = screen.getByLabelText(/search for recipes/i)
    
    fireEvent.change(input, { target: { value: 'pasta' } })
    expect(input.value).toBe('pasta')
  })
})

