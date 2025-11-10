import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Badge } from '@/components/ui/Badge'

/**
 * DesktopExclusionPanel - Desktop side panel for ingredient exclusion.
 * Presentational component.
 * 
 * @param {Object} props
 * @param {number} props.excludedCount - Number of excluded ingredients
 * @param {boolean} props.isUpdating - Loading state
 * @param {string|null} props.error - Error message
 * @param {Function} props.onApply - Apply handler
 * @param {Function} props.onReset - Reset handler
 */
export function DesktopExclusionPanel({ excludedCount, isUpdating, error, onApply, onReset }) {
  return (
    <div className="hidden lg:block lg:sticky lg:top-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-xl p-5 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Badge count={excludedCount} size="md" shape="circle" variant="primary" />
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
  )
}

