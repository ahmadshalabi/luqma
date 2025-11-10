import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InstructionStep } from '@/pages/recipe/instructions/InstructionStep'

describe('InstructionStep', () => {
  it('renders instruction with step number', () => {
    render(<InstructionStep instruction="Preheat oven" stepNumber={1} />)
    expect(screen.getByText('Preheat oven')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('includes accessible step label', () => {
    render(<InstructionStep instruction="Mix ingredients" stepNumber={2} />)
    expect(screen.getByLabelText('Step 2')).toBeInTheDocument()
  })

  it('handles different step numbers', () => {
    const { rerender } = render(<InstructionStep instruction="Step 1" stepNumber={1} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    
    rerender(<InstructionStep instruction="Step 2" stepNumber={2} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('handles long instruction text', () => {
    const long = 'This is a very long instruction with multiple sentences and detailed steps.'
    render(<InstructionStep instruction={long} stepNumber={1} />)
    expect(screen.getByText(long)).toBeInTheDocument()
  })
})

