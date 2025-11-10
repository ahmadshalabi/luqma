import { Container } from '@/components/layout/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

/**
 * RecipeLoading - Loading state for recipe page.
 * Presentational component.
 */
export function RecipeLoading() {
  return (
    <Container>
      <LoadingSpinner size="lg" text="Loading recipe..." />
    </Container>
  )
}

