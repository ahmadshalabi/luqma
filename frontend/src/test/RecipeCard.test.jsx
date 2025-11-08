import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeCard } from '@/features/recipe/RecipeCard'

describe('RecipeCard', () => {
  const mockRecipe = {
    id: 1,
    title: 'Pasta Carbonara',
    image: 'https://example.com/pasta.jpg',
  }

  it('should render recipe image and title', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByRole('img', { name: 'Pasta Carbonara' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pasta Carbonara' })).toBeInTheDocument()
  })

  it('should have accessible button label', () => {
    render(<RecipeCard recipe={mockRecipe} />)
    
    expect(screen.getByRole('button', { name: 'View recipe: Pasta Carbonara' })).toBeInTheDocument()
  })
})

