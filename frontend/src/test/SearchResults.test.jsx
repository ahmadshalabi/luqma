import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SearchResults } from '../components/SearchResults'

describe('SearchResults', () => {
  it('should render recipes', () => {
    const recipes = [
      { id: 1, title: 'Pasta Carbonara', image: 'pasta.jpg' },
      { id: 2, title: 'Chicken Alfredo', image: 'chicken.jpg' },
    ]
    render(<SearchResults recipes={recipes} />)
    
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.getByText('Chicken Alfredo')).toBeInTheDocument()
  })

  it('should show empty state when no recipes', () => {
    render(<SearchResults recipes={[]} />)
    
    expect(screen.getByText('No recipes found')).toBeInTheDocument()
  })
})

