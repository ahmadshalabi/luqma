import { useParams, useLocation } from 'react-router-dom'
import { useRecipeDetail } from '@/hooks/useRecipeDetail'
import { RecipeDetail } from '@/features/recipe/RecipeDetail'
import { BackLink } from '@/primitives/BackLink'
import { LoadingState } from '@/primitives/LoadingState'
import { MessageState } from '@/primitives/MessageState'
import { MainLayout } from '@/features/layout/MainLayout'

/**
 * RecipePage component displaying full recipe details.
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

  if (loading) {
    return (
      <LoadingState
        message="Loading recipe..."
        size="lg"
        wrapper="main"
        wrapperClassName="flex-grow container mx-auto px-4 py-8"
      />
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="mb-6">
          <BackLink to={backLink}>Back to search</BackLink>
        </div>
        <MessageState
          variant="error"
          title="Error"
          message={error}
          action={
            <button
              onClick={retry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
          }
        />
      </MainLayout>
    )
  }

  if (!recipe) {
    return (
      <MainLayout>
        <div className="mb-6">
          <BackLink to={backLink}>Back to search</BackLink>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Recipe not found.</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <nav className="mb-6" aria-label="Breadcrumb">
        <BackLink to={backLink}>Back to search</BackLink>
      </nav>

      <RecipeDetail recipe={recipe} />
    </MainLayout>
  )
}

