import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '@/features/layout/Header'

describe('Header', () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  it('should render logo and navigation links', () => {
    renderWithRouter(<Header />)
    
    expect(screen.getByRole('link', { name: 'Luqma' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Recipes' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('should toggle mobile menu', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Header />)
    
    const menuButton = screen.getByRole('button', { name: 'Toggle navigation menu' })
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument()
    
    await user.click(menuButton)
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument()
  })
})

