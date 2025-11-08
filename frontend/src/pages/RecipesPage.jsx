import { PageSection } from '@/features/layout/PageSection'
import { EmptyState } from '@/primitives/EmptyState'
import { Button } from '@/primitives/Button'

export const RecipesPage = () => {
  return (
    <main id="main-content" className="flex-grow">
      <PageSection className="min-h-[60vh] flex items-center">
        <EmptyState
          icon="clock"
          title="Coming Soon"
          message="We're working hard to bring you an amazing recipe browsing experience. Check back soon to explore our full collection of recipes!"
          action={<Button to="/" variant="primary">Back to Home</Button>}
        />
      </PageSection>
    </main>
  )
}

