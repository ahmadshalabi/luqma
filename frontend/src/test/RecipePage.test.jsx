import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RecipePage } from '@/pages/recipe/RecipePage'
import * as apiClient from '@/services/apiClient'

vi.mock('@/services/apiClient')

const renderRecipePage = (id = '715497') => {
  return render(
    <MemoryRouter initialEntries={[`/recipe/${id}`]}>
      <Routes>
        <Route path="/recipe/:id" element={<RecipePage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('RecipePage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows loading state', () => {
    vi.mocked(apiClient.getRecipeById).mockImplementation(() => new Promise(() => {}))
    renderRecipePage()
    expect(screen.getByText(/loading recipe/i)).toBeInTheDocument()
  })

  it('displays recipe details', async () => {
    const mockRecipe = { id: 715497, title: 'Test Recipe', image: 'test.jpg', servings: 2, readyInMinutes: 20, ingredients: [], nutrition: {}, instructions: [] }
    vi.mocked(apiClient.getRecipeById).mockResolvedValue(mockRecipe)
    
    renderRecipePage()
    await waitFor(() => expect(screen.getAllByText('Test Recipe')).toHaveLength(2))
  })

  it('shows error state', async () => {
    vi.mocked(apiClient.getRecipeById).mockRejectedValue(new Error('Failed'))
    renderRecipePage()
    await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument())
  })
})

