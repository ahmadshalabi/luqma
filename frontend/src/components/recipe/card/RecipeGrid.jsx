import { RecipeCard } from './RecipeCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Grid } from '@/components/ui/Grid'

/**
 * RecipeGrid Component
 * 
 * Displays a grid of recipe cards with optional empty state.
 * 
 * @param {Object} props
 * @param {Array} props.recipes - Array of recipe objects to display
 * @param {string} props.emptyTitle - Title for empty state
 * @param {string} props.emptyMessage - Message for empty state
 */
export function RecipeGrid({ recipes = [], emptyTitle, emptyMessage }) {
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
    <Grid cols={{ default: 1, sm: 2, lg: 3 }} gap={6}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </Grid>
  )
}

