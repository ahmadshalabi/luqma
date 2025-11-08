import PropTypes from 'prop-types'
import { RecipeCard } from './RecipeCard'

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
      <div className="flex flex-col items-center justify-center py-12 px-4" role="status" aria-live="polite">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{emptyTitle}</h3>
        <p className="text-base text-gray-600 text-center">
          {emptyMessage}
        </p>
      </div>
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

RecipeGrid.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
  emptyTitle: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
}

