import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsHeader } from '@/components/search/ResultsHeader'

describe('ResultsHeader', () => {
  it('renders title and count', () => {
    render(
      <ResultsHeader
        title="Search Results"
        totalCount={10}
        startItem={1}
        endItem={10}
        itemLabel="recipe"
      />
    )

    expect(screen.getByRole('heading', { name: /search results/i })).toBeInTheDocument()
    expect(screen.getByText(/Showing/i)).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText(/recipes/i)).toBeInTheDocument()
  })

  it('shows pagination info when provided', () => {
    render(
      <ResultsHeader
        title="Search Results"
        totalCount={25}
        startItem={1}
        endItem={9}
        itemLabel="recipe"
      />
    )

    expect(screen.getByText(/Showing/i)).toBeInTheDocument()
    expect(screen.getByText('1-9')).toBeInTheDocument()
    expect(screen.getByText(/of/i)).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })
})

