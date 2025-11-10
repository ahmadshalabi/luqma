import { Heading } from '@/components/ui/Typography'

/**
 * ResultsHeader component for displaying search results count and range.
 * 
 * @param {Object} props
 * @param {string} props.title - Header title
 * @param {number} props.totalCount - Total number of results
 * @param {number} props.startItem - Starting item number (1-indexed)
 * @param {number} props.endItem - Ending item number (inclusive)
 * @param {string} props.itemLabel - Label for items (e.g., "recipe")
 */
export function ResultsHeader({ title, totalCount, startItem, endItem, itemLabel }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <Heading as="h2" size="lg">
        {title}
      </Heading>
      {totalCount > 0 && (
        <p className="text-sm md:text-base text-gray-600">
          Showing <span className="font-medium text-gray-900">{startItem}-{endItem}</span> of{' '}
          <span className="font-medium text-gray-900">{totalCount}</span> {itemLabel}{totalCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

