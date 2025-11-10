import { RecipeExclusionProvider } from '@/contexts/RecipeExclusionContext'
import { RecipeDetail } from './features/detail/RecipeDetail'
import { Container } from '@/components/layout/Container'
import { BackLink } from '@/components/ui/BackLink'

/**
 * RecipeContent - Success state for recipe page with full recipe details.
 * Functional component that wraps RecipeDetail in Context provider.
 * 
 * @param {Object} props
 * @param {Object} props.recipe - Recipe data
 * @param {string} props.backLink - URL to navigate back to
 */
export function RecipeContent({ recipe, backLink }) {
  return (
    <Container containerSize="wide">
      <nav className="mb-6" aria-label="Breadcrumb">
        <BackLink to={backLink}>Back to search</BackLink>
      </nav>

      <RecipeExclusionProvider initialRecipe={recipe}>
        <RecipeDetail />
      </RecipeExclusionProvider>
    </Container>
  )
}

