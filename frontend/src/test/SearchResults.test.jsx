import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SearchResults } from '../components/SearchResults'

describe('SearchResults', () => {
  const mockRecipes = [
    { id: 1, title: 'Pasta Carbonara', image: 'pasta.jpg' },
    { id: 2, title: 'Chicken Alfredo', image: 'chicken.jpg' },
  ]

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should render recipe cards', () => {
    renderWithRouter(<SearchResults recipes={mockRecipes} />)
    
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.getByText('Chicken Alfredo')).toBeInTheDocument()
  })

  it('should display empty state when no recipes', () => {
    renderWithRouter(<SearchResults recipes={[]} />)
    
    expect(screen.getByText(/no recipes found/i)).toBeInTheDocument()
  })
})

