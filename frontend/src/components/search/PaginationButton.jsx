/**
 * PaginationButton primitive component.
 * Presentational button for pagination.
 * 
 * @param {Object} props
 * @param {number} props.page - Page number
 * @param {boolean} props.isActive - Active state
 * @param {Function} props.onClick - Click handler
 * @param {Function} [props.onKeyDown] - KeyDown handler
 */
export function PaginationButton({ page, isActive, onClick, onKeyDown }) {
  const baseClasses = 'inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
  const activeClasses = 'bg-blue-600 text-white hover:bg-blue-700'
  const inactiveClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={`Go to page ${page}`}
      aria-current={isActive ? 'page' : undefined}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {page}
    </button>
  )
}

