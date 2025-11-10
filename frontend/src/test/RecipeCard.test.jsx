import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecipeCard } from '@/components/recipe/card/RecipeCard'

describe('RecipeCard', () => {
  const mockRecipe = {
    id: 1,
    title: 'Pasta Carbonara',
    image: 'https://example.com/pasta.jpg',
  }

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should render recipe image and title', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByRole('img', { name: 'Pasta Carbonara' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pasta Carbonara' })).toBeInTheDocument()
  })

  it('should have accessible link label', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByRole('link', { name: 'View recipe: Pasta Carbonara' })).toBeInTheDocument()
  })
})

