import { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * SearchBar component for recipe search functionality.
 *
 * @param {Object} props
 * @param {Function} props.onSearch - Callback function called with search query on submit
 */
export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch && query.trim()) {
      onSearch(query)
    }
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="recipe-search" className="sr-only">
        Search for recipes
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="recipe-search"
          type="search"
          name="search"
          value={query}
          onChange={handleInputChange}
          className="w-full pl-12 pr-4 py-4 text-base md:text-lg text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Search for recipes..."
          aria-label="Search for recipes"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Try searching for &ldquo;pasta&rdquo;, &ldquo;chicken&rdquo;, or your favorite dish
      </p>
    </form>
  )
}

SearchBar.propTypes = {
  onSearch: PropTypes.func,
}

