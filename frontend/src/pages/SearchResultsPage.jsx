import { useSearchParams, Link } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { SearchResults } from '../components/SearchResults'
import { getRecipeSearchResults } from '@/mocks'
import { filterRecipes } from '../utils/searchUtils'

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  // Load mock data
  const { results: allRecipes } = getRecipeSearchResults()

  // Filter recipes based on search query
  const filteredRecipes = filterRecipes(allRecipes, query)

  const handleSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery })
    }
  }

  return (
    <main id="main-content" className="flex-grow">
      {/* Search Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {query ? (
            <>
              <div className="flex items-baseline justify-between">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Search Results for &ldquo;{query}&rdquo;
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
                </p>
              </div>
              <SearchResults recipes={filteredRecipes} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Search for Recipes
              </h1>
              <p className="text-base text-gray-600 text-center">
                Enter a search term above to find recipes
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

