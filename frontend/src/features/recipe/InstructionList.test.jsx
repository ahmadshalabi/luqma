import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InstructionList } from './InstructionList'

describe('InstructionList', () => {
  it('should render numbered instructions', () => {
    // Given: Mock instructions
    const instructions = [
      'Preheat oven to 350°F',
      'Mix ingredients together',
      'Bake for 30 minutes'
    ]
    
    // When: Component is rendered
    render(<InstructionList instructions={instructions} />)
    
    // Then: All instructions are displayed with numbers
    expect(screen.getByText(/preheat oven/i)).toBeInTheDocument()
    expect(screen.getByText(/mix ingredients/i)).toBeInTheDocument()
    expect(screen.getByText(/bake for 30 minutes/i)).toBeInTheDocument()
    
    // Check step numbers are present
    expect(screen.getByLabelText('Step 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Step 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Step 3')).toBeInTheDocument()
  })

  it('should handle empty instructions array', () => {
    // When: Component is rendered with empty array
    render(<InstructionList instructions={[]} />)
    
    // Then: Empty state message is shown
    expect(screen.getByText(/no cooking instructions available/i)).toBeInTheDocument()
  })
})

