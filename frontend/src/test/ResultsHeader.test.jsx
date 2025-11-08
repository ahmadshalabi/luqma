import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultsHeader } from '@/features/search/ResultsHeader'

describe('ResultsHeader', () => {
  it('renders title and count', () => {
    render(
      <ResultsHeader
        title="Search Results"
        totalCount={10}
        itemLabel="recipe"
      />
    )

    expect(screen.getByRole('heading', { name: /search results/i })).toBeInTheDocument()
    expect(screen.getByText('10 recipes found')).toBeInTheDocument()
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

    expect(screen.getByText('Showing 1-9 of 25')).toBeInTheDocument()
  })
})

