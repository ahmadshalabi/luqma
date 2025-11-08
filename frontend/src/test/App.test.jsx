import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '../App'

vi.mock('@/mocks', () => ({
  getPopularRecipes: () => [
    { id: 1, title: 'Pasta Carbonara', image: 'pasta.jpg' },
  ],
  getRecipeSearchResults: () => ({
    results: [],
  }),
}))

describe('App', () => {
  it('should render header, main content, and footer', async () => {
    render(<App />)
    
    expect(screen.getByRole('link', { name: 'Luqma' })).toBeInTheDocument()
    // Wait for lazy-loaded HomePage to render
    expect(await screen.findByRole('heading', { name: 'Welcome to Luqma' })).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})
