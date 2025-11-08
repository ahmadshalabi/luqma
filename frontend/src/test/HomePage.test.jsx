import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'

vi.mock('@/mocks', () => ({
  getRecipeSearchResults: () => ({
    results: [
      { id: 1, title: 'Pasta Carbonara', image: 'pasta.jpg' },
      { id: 2, title: 'Chicken Pasta', image: 'chicken.jpg' },
    ],
  }),
}))

describe('HomePage', () => {
  it('should render heading and search bar', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    
    expect(screen.getByRole('heading', { name: 'Welcome to Luqma' })).toBeInTheDocument()
    expect(screen.getByLabelText(/search for recipes/i)).toBeInTheDocument()
  })

  it('should show search results with query param', () => {
    render(
      <MemoryRouter initialEntries={['/?q=pasta']}>
        <HomePage />
      </MemoryRouter>
    )
    
    expect(screen.getByText(/search results for/i)).toBeInTheDocument()
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })

  it('should not show results when no search query', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    
    expect(screen.queryByText(/search results for/i)).not.toBeInTheDocument()
  })
})

