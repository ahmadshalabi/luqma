import { LoadingSpinner } from '@/primitives/LoadingSpinner'
import { CountBadge } from '@/primitives/CountBadge'

/**
 * IngredientExclusionPanel component displaying controls for ingredient exclusion.
 * Shows excluded count, apply button, and reset button.
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
      {/* Mobile: Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-blue-500 shadow-2xl animate-slide-up">
        <div className="safe-area-inset-bottom">
          {error && (
            <div
              className="bg-red-50 border-t-2 border-red-300 px-4 py-3 text-sm text-red-700"
              role="alert"
              aria-live="polite"
            >
              ⚠️ {error}
            </div>
          )}
          
          <div className="p-4 pb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CountBadge count={excludedCount} size="lg" pulse />
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {excludedCount} {excludedCount === 1 ? 'ingredient' : 'ingredients'}
                  </p>
                  <p className="text-sm text-gray-600">Ready to exclude</p>
                </div>
              </div>
              
              <button
                onClick={onReset}
                disabled={isUpdating}
                className="text-sm text-gray-600 hover:text-gray-900 underline disabled:opacity-50"
                aria-label="Reset ingredient selections"
              >
                Clear
              </button>
            </div>

            <button
              onClick={onApply}
              disabled={isUpdating || excludedCount === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 rounded-2xl font-bold text-xl
                       hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300
                       disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
                       transition-all duration-150 shadow-xl hover:shadow-2xl
                       flex items-center justify-center gap-3"
              aria-label="Apply ingredient exclusions"
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Updating Nutrition...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Apply & Recalculate</span>
                  <span className="text-2xl">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Sticky Side Panel */}
      <div className="hidden lg:block lg:sticky lg:top-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CountBadge count={excludedCount} size="md" />
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900">
                {excludedCount} selected
              </p>
              <p className="text-xs text-gray-700 mt-1">
                Click Apply to recalculate nutrition
              </p>
            </div>
          </div>

          {error && (
            <div
              className="text-sm text-red-600 bg-red-50 border-2 border-red-300 rounded-lg px-3 py-2"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={onApply}
              disabled={isUpdating || excludedCount === 0}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-base
                       hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300
                       disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-all duration-150 shadow-md hover:shadow-lg
                       flex items-center justify-center gap-2"
              aria-label="Apply ingredient exclusions"
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>Apply Changes</span>
                  <span>→</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              disabled={isUpdating}
              className="w-full bg-white text-gray-700 px-6 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-sm
                       hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150"
              aria-label="Reset ingredient selections"
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

