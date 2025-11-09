import { memo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card } from '@/primitives/Card'
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
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
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

