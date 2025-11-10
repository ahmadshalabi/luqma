import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IngredientItem } from '@/pages/recipe/ingredients/IngredientItem'

describe('IngredientItem', () => {
  const ingredient = { id: 1, name: 'Chicken', amount: 2, unit: 'lbs' }

  it('renders ingredient with amount and unit', () => {
    render(<IngredientItem ingredient={ingredient} />)
    expect(screen.getByText((_, el) => el?.textContent === '2 lbs - Chicken')).toBeInTheDocument()
  })

  it('renders ingredient without amount', () => {
    render(<IngredientItem ingredient={{ id: 1, name: 'Salt' }} />)
    expect(screen.getByText('Salt')).toBeInTheDocument()
  })

  it('shows exclusion button when enabled', () => {
    render(<IngredientItem ingredient={ingredient} exclusionEnabled onToggleExclude={vi.fn()} />)
    expect(screen.getByRole('button', { name: /exclude/i })).toBeInTheDocument()
  })

  it('calls onToggleExclude with ingredient id', () => {
    const onToggle = vi.fn()
    render(<IngredientItem ingredient={ingredient} exclusionEnabled onToggleExclude={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('shows Selected when excluded', () => {
    render(<IngredientItem ingredient={ingredient} exclusionEnabled isExcluded onToggleExclude={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveTextContent('Selected')
  })

  it('applies excluded styles', () => {
    const { container } = render(<IngredientItem ingredient={ingredient} isExcluded />)
    expect(container.querySelector('li')).toHaveClass('opacity-50')
  })

  it('handles missing ingredient name', () => {
    render(<IngredientItem ingredient={{ id: 1, amount: 1, unit: 'cup' }} />)
    expect(screen.getByText('Unknown ingredient')).toBeInTheDocument()
  })

  it('formats decimal and whole numbers correctly', () => {
    const { rerender } = render(<IngredientItem ingredient={{ id: 1, name: 'Sugar', amount: 1.5, unit: 'cups' }} />)
    expect(screen.getByText((_, el) => el?.textContent === '1.5 cups - Sugar')).toBeInTheDocument()
    
    rerender(<IngredientItem ingredient={{ id: 1, name: 'Eggs', amount: 2, unit: '' }} />)
    expect(screen.getByText('Eggs')).toBeInTheDocument()
  })
})

