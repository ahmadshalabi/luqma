import { RecipeCard } from './RecipeCard'
import { EmptyState } from '@/primitives/EmptyState'

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
export const RecipeGrid = ({ recipes = [], emptyTitle, emptyMessage }) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

