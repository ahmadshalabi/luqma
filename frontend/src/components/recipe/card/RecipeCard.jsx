import { memo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { useImageFallback } from '@/hooks/useImageFallback'
import { RecipeCardImage } from './RecipeCardImage'
import { RecipeCardContent } from './RecipeCardContent'

/**
 * RecipeCard Component
 * 
 * Displays a single recipe card with image and title.
 * Card is interactive and accessible via keyboard navigation.
 * Memoized to prevent unnecessary re-renders when recipe data hasn't changed.
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
        <RecipeCardImage
          src={recipe.image}
          alt={recipe.title}
          hasError={imageError}
          onError={handleImageError}
        />
        <RecipeCardContent title={recipe.title} />
      </Link>
    </Card>
  )
}

export const RecipeCard = memo(RecipeCardComponent)

