import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CollapsibleNutrition } from './CollapsibleNutrition'

describe('CollapsibleNutrition', () => {
  const mockNutrition = {
    calories: 594,
    protein: 35.3,
    fat: 36.5,
    carbohydrates: 29.7,
    fiber: 1.2,
    percentProtein: 70.6,
    percentFat: 56.15,
    percentCarbs: 9.9
  }

  it('renders collapsed by default', () => {
    render(<CollapsibleNutrition nutrition={mockNutrition} />)
    
    expect(screen.getByText('Nutrition Facts')).toBeInTheDocument()
    expect(screen.getByText('594 calories per serving')).toBeInTheDocument()
    
    const button = screen.getByRole('button', { name: /nutrition facts/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('expands when clicked', async () => {
    render(<CollapsibleNutrition nutrition={mockNutrition} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
    
    expect(screen.getByText('594')).toBeInTheDocument()
    expect(screen.getByText('kcal')).toBeInTheDocument()
    expect(screen.getByText('Protein')).toBeInTheDocument()
    expect(screen.getByText('Fat')).toBeInTheDocument()
  })

  it('can be expanded by default', () => {
    render(<CollapsibleNutrition nutrition={mockNutrition} defaultExpanded={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('594')).toBeInTheDocument()
    expect(screen.getByText('kcal')).toBeInTheDocument()
  })

  it('expands when forceExpand prop is true', async () => {
    const { rerender } = render(
      <CollapsibleNutrition nutrition={mockNutrition} forceExpand={false} />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    
    rerender(<CollapsibleNutrition nutrition={mockNutrition} forceExpand={true} />)
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('does not render when nutrition data is missing', () => {
    const { container } = render(<CollapsibleNutrition nutrition={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('does not render when all nutrition values are zero', () => {
    const emptyNutrition = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      fiber: 0
    }
    
    const { container } = render(<CollapsibleNutrition nutrition={emptyNutrition} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('toggles between collapsed and expanded states', async () => {
    render(<CollapsibleNutrition nutrition={mockNutrition} />)
    
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('aria-expanded', 'false')
    
    fireEvent.click(button)
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
    
    fireEvent.click(button)
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('has smooth transition classes for animation', () => {
    render(<CollapsibleNutrition nutrition={mockNutrition} />)
    
    const container = screen.getByRole('button').parentElement
    expect(container).toHaveClass('transition-all', 'duration-300', 'ease-in-out')
  })
})

