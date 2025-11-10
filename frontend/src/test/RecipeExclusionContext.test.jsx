import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeExclusionProvider, useRecipeExclusion } from '@/contexts/RecipeExclusionContext'

// Mock the API client
vi.mock('@/services/apiClient', () => ({
  excludeIngredients: vi.fn((recipeId) => 
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: recipeId,
          title: 'Test Recipe',
          image: 'test.jpg',
          ingredients: [{ id: 2, name: 'Garlic', amount: 2, unit: 'cloves' }],
          nutrition: { calories: 300 }
        })
      }, 50)
    })
  ),
}))

// Test component to access context
function TestComponent() {
  const {
    currentRecipe,
    excludedIds,
    isUpdating,
    error,
    toggleIngredient,
    applyExclusions,
    resetAll
  } = useRecipeExclusion()

  return (
    <div>
      <h1>{currentRecipe?.title}</h1>
      <div data-testid="excluded-count">{excludedIds.size}</div>
      <div data-testid="is-updating">{isUpdating ? 'true' : 'false'}</div>
      {error && <div data-testid="error">{error}</div>}
      <button onClick={() => toggleIngredient(1)}>Toggle Ingredient 1</button>
      <button onClick={applyExclusions}>Apply Exclusions</button>
      <button onClick={resetAll}>Reset All</button>
    </div>
  )
}

describe('RecipeExclusionContext', () => {
  const mockRecipe = {
    id: 123,
    title: 'Test Recipe',
    image: 'test.jpg',
    ingredients: [
      { id: 1, name: 'Tomato', amount: 3, unit: 'pieces' },
      { id: 2, name: 'Garlic', amount: 2, unit: 'cloves' }
    ],
    nutrition: { calories: 500 }
  }

  it('provides initial recipe state', () => {
    render(
      <RecipeExclusionProvider initialRecipe={mockRecipe}>
        <TestComponent />
      </RecipeExclusionProvider>
    )

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.getByTestId('excluded-count')).toHaveTextContent('0')
  })

  it('toggles ingredient selection', async () => {
    const user = userEvent.setup()
    render(
      <RecipeExclusionProvider initialRecipe={mockRecipe}>
        <TestComponent />
      </RecipeExclusionProvider>
    )

    const toggleButton = screen.getByText('Toggle Ingredient 1')
    await user.click(toggleButton)

    expect(screen.getByTestId('excluded-count')).toHaveTextContent('1')

    // Toggle again to deselect
    await user.click(toggleButton)
    expect(screen.getByTestId('excluded-count')).toHaveTextContent('0')
  })

  it('applies exclusions and updates recipe', async () => {
    const user = userEvent.setup()
    render(
      <RecipeExclusionProvider initialRecipe={mockRecipe}>
        <TestComponent />
      </RecipeExclusionProvider>
    )

    // Select an ingredient
    await user.click(screen.getByText('Toggle Ingredient 1'))
    expect(screen.getByTestId('excluded-count')).toHaveTextContent('1')

    // Apply exclusions
    await user.click(screen.getByText('Apply Exclusions'))

    // Should show loading state
    expect(screen.getByTestId('is-updating')).toHaveTextContent('true')

    // Wait for update to complete
    await waitFor(() => {
      expect(screen.getByTestId('is-updating')).toHaveTextContent('false')
    })

    // Selection should be cleared after apply
    expect(screen.getByTestId('excluded-count')).toHaveTextContent('0')
  })

  it('shows error when applying with no selection', async () => {
    const user = userEvent.setup()
    render(
      <RecipeExclusionProvider initialRecipe={mockRecipe}>
        <TestComponent />
      </RecipeExclusionProvider>
    )

    // Try to apply without selecting anything
    await user.click(screen.getByText('Apply Exclusions'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Please select at least one ingredient')
    })
  })

  it('resets all state', async () => {
    const user = userEvent.setup()
    render(
      <RecipeExclusionProvider initialRecipe={mockRecipe}>
        <TestComponent />
      </RecipeExclusionProvider>
    )

    // Select an ingredient
    await user.click(screen.getByText('Toggle Ingredient 1'))
    expect(screen.getByTestId('excluded-count')).toHaveTextContent('1')

    // Reset
    await user.click(screen.getByText('Reset All'))
    expect(screen.getByTestId('excluded-count')).toHaveTextContent('0')
  })
})

