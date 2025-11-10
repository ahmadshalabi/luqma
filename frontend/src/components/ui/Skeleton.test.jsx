import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton, RecipeCardSkeleton, RecipeGridSkeleton, RecipeDetailSkeleton } from './Skeleton'

describe('Skeleton', () => {
  it('should render with animation and variants', () => {
    const { container, rerender } = render(<Skeleton />)
    let skeleton = container.firstChild
    
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-lg')
    expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    
    rerender(<Skeleton variant="text" />)
    expect(container.firstChild).toHaveClass('rounded', 'h-4')
    
    rerender(<Skeleton variant="circle" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('should apply custom styles and classes', () => {
    const { container } = render(<Skeleton width="200px" height="100px" className="custom" />)
    
    expect(container.firstChild).toHaveStyle({ width: '200px', height: '100px' })
    expect(container.firstChild).toHaveClass('custom')
  })
})

describe('RecipeCardSkeleton', () => {
  it('should render card with skeleton elements', () => {
    const { container } = render(<RecipeCardSkeleton />)
    
    expect(container.querySelector('.bg-white')).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0)
  })
})

describe('RecipeGridSkeleton', () => {
  it('should render grid with specified number of cards', () => {
    const { container, rerender } = render(<RecipeGridSkeleton />)
    
    expect(container.firstChild).toHaveClass('grid')
    expect(container.querySelectorAll('.bg-white').length).toBe(9)
    
    rerender(<RecipeGridSkeleton count={3} />)
    expect(container.querySelectorAll('.bg-white').length).toBe(3)
  })
})

describe('RecipeDetailSkeleton', () => {
  it('should render detail page structure with multiple sections', () => {
    const { container } = render(<RecipeDetailSkeleton />)
    
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(5)
    expect(container.querySelectorAll('.grid').length).toBeGreaterThan(0)
  })
})

