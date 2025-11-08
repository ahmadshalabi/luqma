import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecipeGrid } from '@/features/recipe/RecipeGrid'

describe('RecipeGrid', () => {
  const mockRecipes = [
    { id: 1, title: 'Pasta Carbonara', image: 'pasta.jpg' },
    { id: 2, title: 'Chicken Alfredo', image: 'chicken.jpg' },
  ]

  it('should render all recipes', () => {
    render(<RecipeGrid recipes={mockRecipes} emptyTitle="Empty" emptyMessage="No recipes" />)
    
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.getByText('Chicken Alfredo')).toBeInTheDocument()
  })

  it('should show empty state when no recipes', () => {
    render(<RecipeGrid recipes={[]} emptyTitle="No recipes" emptyMessage="Try again" />)
    
    expect(screen.getByText('No recipes')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })
})

