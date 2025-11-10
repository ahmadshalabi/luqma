import { Container } from '@/components/layout/Container'
import { BackLink } from '@/components/ui/BackLink'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'

/**
 * RecipeErrorState - Unified error/not-found state for recipe page.
 * Presentational component for displaying various recipe error states.
 * 
 * @param {Object} props
 * @param {string} props.backLink - URL to navigate back to
 * @param {'error'|'info'|'warning'} [props.variant='error'] - Alert variant
 * @param {string} props.title - Alert title
 * @param {string} props.message - Error or info message
 * @param {Function} [props.onRetry] - Optional retry handler (shows retry button)
 */
export function RecipeErrorState({ 
  backLink, 
  variant = 'error', 
  title, 
  message, 
  onRetry 
}) {
  return (
    <Container>
      <div className="mb-6">
        <BackLink to={backLink}>Back to search</BackLink>
      </div>
      <Alert
        variant={variant}
        title={title}
        message={message}
        action={onRetry && <Button onClick={onRetry}>Try Again</Button>}
      />
    </Container>
  )
}

