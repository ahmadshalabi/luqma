import { memo } from 'react'
import PropTypes from 'prop-types'

/**
 * RecipeCard Component
 * 
 * Displays a single recipe card with image and title.
 * Card is interactive and accessible via keyboard navigation.
 * 
 * @param {Object} props
 * @param {Object} props.recipe - Recipe object containing id, title, and image
 */
const RecipeCardComponent = ({ recipe }) => {
  return (
    <article
      className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm transition-all hover:shadow-md hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500"
    >
      <button
        type="button"
        className="flex flex-col w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`View recipe: ${recipe.title}`}
      >
        <div className="relative w-full h-48 bg-gray-100">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {recipe.title}
          </h3>
        </div>
      </button>
    </article>
  )
}

RecipeCardComponent.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
}

// Memoize component to prevent unnecessary re-renders
export const RecipeCard = memo(RecipeCardComponent)

