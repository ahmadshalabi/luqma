import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/Collapsible'

describe('Collapsible', () => {
  it('renders collapsed by default', () => {
    render(<Collapsible trigger="Click me"><div>Content</div></Collapsible>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('expands when defaultExpanded is true', () => {
    render(<Collapsible trigger="Click me" defaultExpanded={true}><div>Content</div></Collapsible>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('toggles when clicked', () => {
    render(<Collapsible trigger="Click me"><div>Content</div></Collapsible>)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('uses controlled state', () => {
    const onToggle = vi.fn()
    const { rerender } = render(
      <Collapsible trigger="Click me" controlled={true} isExpanded={false} onToggle={onToggle}>
        <div>Content</div>
      </Collapsible>
    )
    
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledWith(true)
    
    rerender(<Collapsible trigger="Click me" controlled={true} isExpanded={true} onToggle={onToggle}><div>Content</div></Collapsible>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('hides chevron when showChevron is false', () => {
    render(<Collapsible trigger="Click me" showChevron={false}><div>Content</div></Collapsible>)
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument()
  })

  it('uses custom id for aria-controls', () => {
    render(<Collapsible trigger="Click me" id="custom-id"><div>Content</div></Collapsible>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'custom-id')
  })
})

describe('CollapsibleTrigger', () => {
  it('renders title and subtitle', () => {
    render(<CollapsibleTrigger title="Title" subtitle="Subtitle" />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })

  it('renders with badge', () => {
    render(<CollapsibleTrigger title="Title" badge={<span data-testid="badge">Badge</span>} />)
    expect(screen.getByTestId('badge')).toBeInTheDocument()
  })
})

describe('CollapsibleContent', () => {
  it('renders children', () => {
    render(<CollapsibleContent><div>Content</div></CollapsibleContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

