import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from '../App'

vi.mock('@/mocks', () => ({
  getRecipeSearchResults: () => ({
    results: [],
  }),
}))

describe('App', () => {
  it('should render header, main content, and footer', async () => {
    render(<App />)
    
    expect(screen.getByRole('link', { name: 'Luqma' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Welcome to Luqma' })).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})
