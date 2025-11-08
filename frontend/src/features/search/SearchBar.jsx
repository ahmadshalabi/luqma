import { memo } from 'react'
import { Icon } from '@/primitives/Icon'
import { useSearch } from '@/hooks/useSearch'

/**
 * SearchBar component for recipe search functionality.
 * Supports both live search (via onChange) and form submission (via onSearch).
 *
 * @param {Object} props
 * @param {Function} props.onSearch - Callback function called with search query on form submit
 * @param {Function} props.onChange - Callback function called with search query on input change (debounced)
 * @param {string} props.initialQuery - Initial search query value
 * @param {number} props.debounceMs - Debounce delay in milliseconds (default: 300)
 */
const SearchBarComponent = ({ onSearch, onChange, initialQuery = '', debounceMs = 300 }) => {
  const { query, handleChange, handleSubmit } = useSearch({
    initialQuery,
    onSubmit: onSearch,
    onChange,
    debounceMs
  })

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="recipe-search" className="sr-only">
        Search for recipes
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Icon name="search" className="text-gray-400" />
        </div>
        <input
          id="recipe-search"
          type="search"
          name="search"
          value={query}
          onChange={handleChange}
          className="w-full pl-12 pr-4 py-4 text-base md:text-lg text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search for recipes..."
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Try searching for &ldquo;pasta&rdquo;, &ldquo;chicken&rdquo;, or your favorite dish
      </p>
    </form>
  )
}

export const SearchBar = memo(SearchBarComponent)

