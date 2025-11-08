import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SearchResultsPage } from '../pages/SearchResultsPage'

// Mock the mocks module
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
  const renderWithRouter = (initialRoute = '/search') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('should display search prompt when no query', () => {
    renderWithRouter('/search')
    expect(screen.getByText(/enter a search term above/i)).toBeInTheDocument()
  })

  it('should display search results with query', () => {
    renderWithRouter('/search?q=pasta')
    expect(screen.getByText(/search results for/i)).toBeInTheDocument()
  })

  it('should filter recipes by query', () => {
    renderWithRouter('/search?q=pasta')
    
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.queryByText('Chicken Alfredo')).not.toBeInTheDocument()
  })

  it('should show empty state when no results', () => {
    renderWithRouter('/search?q=pizza')
    
    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument()
  })

  it('should handle case-insensitive search', () => {
    renderWithRouter('/search?q=PASTA')
    
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })
})

