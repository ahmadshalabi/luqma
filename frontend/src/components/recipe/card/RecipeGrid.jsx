import { memo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RecipeCard } from './RecipeCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Grid } from '@/components/ui/Grid'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

/**
 * RecipeGrid Component
 * 
 * Displays a grid of recipe cards with optional empty state.
 * Supports keyboard navigation with arrow keys.
 * Memoized to prevent unnecessary re-renders when recipes array hasn't changed.
 * 
 * @param {Object} props
 * @param {Array} props.recipes - Array of recipe objects to display
 * @param {string} props.emptyTitle - Title for empty state
 * @param {string} props.emptyMessage - Message for empty state
 */
const RecipeGridComponent = ({ recipes = [], emptyTitle, emptyMessage }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Determine columns based on viewport (simplified - matches Tailwind breakpoints)
  // In a real implementation, you'd use a hook to detect viewport size
  const columns = 3 // lg breakpoint default

  const handleItemSelect = useCallback((index) => {
    const recipe = recipes[index]
    if (recipe) {
      const query = searchParams.get('q') || ''
      const page = searchParams.get('page') || '1'
      navigate(`/recipe/${recipe.id}`, { state: { query, page } })
    }
  }, [recipes, searchParams, navigate])

  const { handleKeyDown, setItemRef } = useKeyboardNavigation({
    itemCount: recipes.length,
    columns,
    enabled: recipes.length > 0,
    onItemSelect: handleItemSelect
  })
  if (!recipes || recipes.length === 0) {
    return (
      <EmptyState
        icon="lightbulb"
        title={emptyTitle}
        message={emptyMessage}
      />
    )
  }

  return (
    <Grid cols={{ default: 1, sm: 2, lg: 3 }} gap={6} onKeyDown={handleKeyDown}>
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          ref={setItemRef(index)}
          tabIndex={index === 0 ? 0 : -1}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        >
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </Grid>
  )
}

export const RecipeGrid = memo(RecipeGridComponent)

