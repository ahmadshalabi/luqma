import { MobileExclusionPanel } from './MobileExclusionPanel'
import { DesktopExclusionPanel } from './DesktopExclusionPanel'

/**
 * IngredientExclusionPanel component displaying controls for ingredient exclusion.
 * Shows excluded count, apply button, and reset button.
 * Wrapper component that renders mobile and desktop variants.
 *
 * @param {Object} props - Component props
 * @param {number} props.excludedCount - Number of excluded ingredients
 * @param {boolean} props.isUpdating - Loading state during API call
 * @param {string|null} props.error - Error message or null
 * @param {Function} props.onApply - Handler for apply button click
 * @param {Function} props.onReset - Handler for reset button click
 * @returns {JSX.Element} IngredientExclusionPanel component
 */
export function IngredientExclusionPanel({
  excludedCount,
  isUpdating,
  error,
  onApply,
  onReset
}) {
  if (excludedCount === 0) {
    return null
  }

  return (
    <>
      <MobileExclusionPanel
        excludedCount={excludedCount}
        isUpdating={isUpdating}
        error={error}
        onApply={onApply}
        onReset={onReset}
      />
      <DesktopExclusionPanel
        excludedCount={excludedCount}
        isUpdating={isUpdating}
        error={error}
        onApply={onApply}
        onReset={onReset}
      />
    </>
  )
}

