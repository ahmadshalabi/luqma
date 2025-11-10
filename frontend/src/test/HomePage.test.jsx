import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { HomePage } from '@/pages/HomePage'

vi.mock('@/services/apiClient', () => ({
  searchRecipes: vi.fn(() => Promise.resolve({
    results: [
      { id: 1, title: 'Pasta Carbonara', image: 'pasta.jpg' },
      { id: 2, title: 'Chicken Pasta', image: 'chicken.jpg' },
    ],
    page: 1,
    pageSize: 9,
    totalResults: 2
  })),
}))

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

  it('should show search results with query param', async () => {
    render(
      <MemoryRouter initialEntries={['/?q=pasta']}>
        <HomePage />
      </MemoryRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/search results for/i)).toBeInTheDocument()
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    })
  })

  it('should not show results when no search query', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    
    expect(screen.queryByText(/search results for/i)).not.toBeInTheDocument()
  })

  it('should clear results when search is cleared', async () => {
    const user = userEvent.setup()
    
    render(
      <MemoryRouter initialEntries={['/?q=pasta']}>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/search results for/i)).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search for recipes/i)
    await user.clear(searchInput)

    await waitFor(() => {
      expect(screen.queryByText(/search results for/i)).not.toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('should not submit empty search', async () => {
    const user = userEvent.setup()
    
    render(<MemoryRouter><HomePage /></MemoryRouter>)

    const searchInput = screen.getByLabelText(/search for recipes/i)
    await user.type(searchInput, '{Enter}')

    expect(screen.queryByText(/search results for/i)).not.toBeInTheDocument()
  })
})

