import { memo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card } from '@/primitives/Card'
import { Icon } from '@/utils/iconRegistry'
import { useImageFallback } from '@/hooks/useImageFallback'

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
  const { imageError, handleImageError } = useImageFallback()
  const [searchParams] = useSearchParams()
  
  const query = searchParams.get('q') || ''
  const page = searchParams.get('page') || '1'
  
  return (
    <Card
      as="article"
      padding="none"
      hover={true}
      interactive={true}
      className="flex flex-col overflow-hidden"
    >
      <Link
        to={`/recipe/${recipe.id}`}
        state={{ query, page }}
        className="flex flex-col w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`View recipe: ${recipe.title}`}
      >
        <div className="relative w-full h-48 bg-gray-100">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Icon name="image" className="w-16 h-16" />
            </div>
          ) : (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
              loading="lazy"
              width="312"
              height="192"
              onError={handleImageError}
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {recipe.title}
          </h3>
        </div>
      </Link>
    </Card>
  )
}

export const RecipeCard = memo(RecipeCardComponent)

