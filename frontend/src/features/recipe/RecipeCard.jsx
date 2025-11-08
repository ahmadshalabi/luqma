import { memo } from 'react'
import { Card } from '@/primitives/Card'

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
    <Card
      as="article"
      padding="none"
      hover={true}
      interactive={true}
      className="flex flex-col overflow-hidden"
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
            width="312"
            height="192"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {recipe.title}
          </h3>
        </div>
      </button>
    </Card>
  )
}

// Memoize component to prevent unnecessary re-renders
export const RecipeCard = memo(RecipeCardComponent)

