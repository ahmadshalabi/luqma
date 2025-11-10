import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LiveRegion, StatusRegion, AlertRegion } from '../components/ui/LiveRegion'

describe('LiveRegion', () => {
  it('should render with aria-live and handle visibility', () => {
    const { rerender } = render(<LiveRegion priority="polite">Test</LiveRegion>)
    
    let region = screen.getByText('Test')
    expect(region).toHaveAttribute('aria-live', 'polite')
    expect(region).toHaveClass('sr-only')
    
    rerender(<LiveRegion priority="polite" visible={true}>Test</LiveRegion>)
    region = screen.getByText('Test')
    expect(region).not.toHaveClass('sr-only')
  })

  it('should not render when no children', () => {
    const { container } = render(<LiveRegion />)
    expect(container.firstChild).toBeNull()
  })

  it('should apply aria-atomic and role when provided', () => {
    render(<LiveRegion atomic={true} role="status">Test</LiveRegion>)
    
    const region = screen.getByText('Test')
    expect(region).toHaveAttribute('aria-atomic', 'true')
    expect(region).toHaveAttribute('role', 'status')
  })
})

describe('StatusRegion', () => {
  it('should render with correct attributes and be hidden by default', () => {
    render(<StatusRegion>Status update</StatusRegion>)
    
    const region = screen.getByText('Status update')
    expect(region).toHaveAttribute('aria-live', 'polite')
    expect(region).toHaveAttribute('role', 'status')
    expect(region).toHaveClass('sr-only')
  })
})

describe('AlertRegion', () => {
  it('should render with correct attributes and be visible by default', () => {
    render(<AlertRegion>Alert message</AlertRegion>)
    
    const region = screen.getByText('Alert message')
    expect(region).toHaveAttribute('aria-live', 'assertive')
    expect(region).toHaveAttribute('role', 'alert')
    expect(region).not.toHaveClass('sr-only')
  })
})

