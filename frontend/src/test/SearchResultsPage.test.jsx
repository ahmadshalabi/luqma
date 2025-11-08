import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SearchResultsPage } from '../pages/SearchResultsPage'

vi.mock('@/mocks', () => ({
  getRecipeSearchResults: () => ({
    results: [
      { id: 1, title: 'Pasta Carbonara', image: 'pasta.jpg' },
      { id: 2, title: 'Chicken Alfredo', image: 'chicken.jpg' },
      { id: 3, title: 'Beef Tacos', image: 'tacos.jpg' },
      { id: 4, title: 'Pasta Primavera', image: 'primavera.jpg' },
    ],
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
    
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.queryByText('Chicken Alfredo')).not.toBeInTheDocument()
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
    
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })
})

