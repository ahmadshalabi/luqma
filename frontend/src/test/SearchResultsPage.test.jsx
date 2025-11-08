import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SearchResultsPage } from '../pages/SearchResultsPage'

// Create a larger dataset to test pagination (need more than 12 items)
const createMockRecipes = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: i % 2 === 0 ? `Pasta Recipe ${i + 1}` : `Chicken Recipe ${i + 1}`,
    image: `recipe-${i + 1}.jpg`,
  }))
}

vi.mock('@/mocks', () => ({
  getRecipeSearchResults: () => ({
    results: createMockRecipes(25), // 25 recipes to test pagination
  }),
}))

describe('SearchResultsPage', () => {
  it('should display search prompt when no query', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByText(/enter a search term above/i)).toBeInTheDocument()
  })

  it('should display search results with query', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=pasta']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByText(/search results for/i)).toBeInTheDocument()
  })

  it('should filter recipes by query', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=pasta']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByText('Pasta Recipe 1')).toBeInTheDocument()
    expect(screen.queryByText('Chicken Recipe 2')).not.toBeInTheDocument()
  })

  it('should show empty state when no results', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=pizza']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument()
  })

  it('should handle case-insensitive search', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=PASTA']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByText('Pasta Recipe 1')).toBeInTheDocument()
  })

  it('should display pagination when results exceed 12 items', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=recipe']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByRole('navigation', { name: 'Pagination navigation' })).toBeInTheDocument()
    expect(screen.getByText(/showing 1-12 of 25/i)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /view recipe:/i }).length).toBe(12)
  })

  it('should not display pagination when results are 12 or fewer', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=pizza']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.queryByRole('navigation', { name: 'Pagination navigation' })).not.toBeInTheDocument()
  })

  it('should navigate between pages', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=recipe&page=2']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByText(/showing 13-24 of 25/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('should handle invalid page parameters', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=recipe&page=invalid']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByText(/showing 1-12 of 25/i)).toBeInTheDocument()
  })

  it('should reset to page 1 when search query changes', async () => {
    const user = userEvent.setup()
    
    render(
      <MemoryRouter initialEntries={['/search?q=recipe&page=2']}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </MemoryRouter>
    )
    
    expect(screen.getByText(/showing 13-24 of 25/i)).toBeInTheDocument()
    
    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'pasta{Enter}')
    
    expect(screen.getByText(/showing 1-12 of 13/i)).toBeInTheDocument()
  })
})

