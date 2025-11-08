import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/mocks', () => ({
  getPopularRecipes: () => [
    { id: 1, title: 'Pasta Carbonara', image: 'pasta.jpg' },
  ],
}))

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('should render heading and search bar', () => {
    render(<BrowserRouter><HomePage /></BrowserRouter>)
    
    expect(screen.getByRole('heading', { name: 'Welcome to Luqma' })).toBeInTheDocument()
    expect(screen.getByLabelText(/search for recipes/i)).toBeInTheDocument()
  })

  it('should navigate to search on submit', async () => {
    const user = userEvent.setup()
    render(<BrowserRouter><HomePage /></BrowserRouter>)
    
    const searchInput = screen.getByLabelText(/search for recipes/i)
    await user.type(searchInput, 'pasta')
    await user.keyboard('{Enter}')
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=pasta')
  })

  it('should show popular recipes', () => {
    render(<BrowserRouter><HomePage /></BrowserRouter>)
    
    expect(screen.getByText('Popular Recipes')).toBeInTheDocument()
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })
})

