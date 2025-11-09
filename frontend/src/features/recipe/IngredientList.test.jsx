import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IngredientList } from './IngredientList'

describe('IngredientList', () => {
  it('should render ingredients with amounts', () => {
    // Given: Mock ingredient data
    const ingredients = [
      { id: 1, name: 'pasta', amount: 16, unit: 'oz' },
      { id: 2, name: 'chicken', amount: 1, unit: 'lb' }
    ]
    
    // When: Component is rendered
    render(<IngredientList ingredients={ingredients} />)
    
    // Then: Ingredients are displayed
    expect(screen.getByText(/pasta/i)).toBeInTheDocument()
    expect(screen.getByText(/chicken/i)).toBeInTheDocument()
    expect(screen.getByText(/16/)).toBeInTheDocument()
    expect(screen.getByText(/oz/)).toBeInTheDocument()
  })

  it('should handle empty ingredients array', () => {
    // When: Component is rendered with empty array
    render(<IngredientList ingredients={[]} />)
    
    // Then: Empty state message is shown
    expect(screen.getByText(/no ingredient information available/i)).toBeInTheDocument()
  })

  it('should handle missing ingredient name', () => {
    // Given: Ingredient without name
    const ingredients = [{ id: 1, amount: 10, unit: 'g' }]
    
    // When: Component is rendered
    render(<IngredientList ingredients={ingredients} />)
    
    // Then: Fallback text is shown
    expect(screen.getByText(/unknown ingredient/i)).toBeInTheDocument()
  })
})

