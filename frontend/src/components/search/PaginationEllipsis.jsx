/**
 * PaginationEllipsis primitive component.
 * Presentational ellipsis for pagination.
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier
 */
export function PaginationEllipsis({ id }) {
  return (
    <span
      key={id}
      className="inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-gray-500"
      aria-hidden="true"
    >
      ...
    </span>
  )
}

