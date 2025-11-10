import { useParams, useLocation } from 'react-router-dom'
import { useRecipeDetail } from '@/hooks/useRecipeDetail'
import { RecipeLoading } from './RecipeLoading'
import { RecipeErrorState } from './RecipeErrorState'
import { RecipeContent } from './RecipeContent'

/**
 * RecipePage - Main page component for recipe details.
 * Orchestrates different states (loading, error, not found, success).
 * Preserves search query when navigating back to search results.
 *
 * @returns {JSX.Element} RecipePage component
 */
export function RecipePage() {
  const { id } = useParams()
  const location = useLocation()
  const { recipe, loading, error, retry } = useRecipeDetail(id)

  const { query = '', page = '1' } = location.state || {}
  const backLink = query ? `/?q=${encodeURIComponent(query)}&page=${page}` : '/'

  if (loading) return <RecipeLoading />

  // Determine error state configuration
  const errorState = error
    ? {
        variant: 'error',
        title: 'Error',
        message: error,
        onRetry: retry
      }
    : !recipe
      ? {
          variant: 'info',
          title: 'Recipe Not Found',
          message: "The recipe you're looking for doesn't exist or has been removed."
        }
      : null

  if (errorState) {
    return <RecipeErrorState backLink={backLink} {...errorState} />
  }
  
  return <RecipeContent recipe={recipe} backLink={backLink} />
}
