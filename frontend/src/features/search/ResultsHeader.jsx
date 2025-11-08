import { memo } from 'react'

/**
 * ResultsHeader Component
 * 
 * Displays a header for filtered results with count and pagination information.
 * Useful for any list view with filtering and pagination.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.title - Header title (can be string or element)
 * @param {number} props.totalCount - Total number of results
 * @param {number} props.startItem - First item number in current page
 * @param {number} props.endItem - Last item number in current page
 * @param {string} props.itemLabel - Label for items (singular form, e.g., "recipe", "item")
 * @param {string} props.className - Additional CSS classes
 */
const ResultsHeaderComponent = ({
  title,
  totalCount,
  startItem,
  endItem,
  itemLabel = 'item',
  className = ''
}) => {
  const pluralLabel = totalCount === 1 ? itemLabel : `${itemLabel}s`

  return (
    <div className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 ${className}`}>
      {typeof title === 'string' ? (
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          {title}
        </h1>
      ) : (
        title
      )}
      <div className="flex flex-col sm:items-end gap-1">
        <p className="text-sm text-gray-600">
          {totalCount} {pluralLabel} found
        </p>
        {totalCount > 0 && startItem && endItem && (
          <p className="text-xs text-gray-500">
            Showing {startItem}-{endItem} of {totalCount}
          </p>
        )}
      </div>
    </div>
  )
}

export const ResultsHeader = memo(ResultsHeaderComponent)

