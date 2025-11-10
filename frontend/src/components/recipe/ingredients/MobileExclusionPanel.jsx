import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { CountBadge } from '@/components/ui/CountBadge'

/**
 * MobileExclusionPanel - Mobile sticky bottom bar for ingredient exclusion.
 * Presentational component.
 * 
 * @param {Object} props
 * @param {number} props.excludedCount - Number of excluded ingredients
 * @param {boolean} props.isUpdating - Loading state
 * @param {string|null} props.error - Error message
 * @param {Function} props.onApply - Apply handler
 * @param {Function} props.onReset - Reset handler
 */
export function MobileExclusionPanel({ excludedCount, isUpdating, error, onApply, onReset }) {
  return (
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
  )
}

