import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecipesPage } from '../pages/RecipesPage'

describe('RecipesPage', () => {
  it('should render coming soon message', () => {
    render(<BrowserRouter><RecipesPage /></BrowserRouter>)
    
    expect(screen.getByRole('heading', { name: 'Coming Soon' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/')
  })
})
