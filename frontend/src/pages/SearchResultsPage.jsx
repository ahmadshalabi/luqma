import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { SearchResults } from '../components/SearchResults'
import { PageSection } from '@/ui/PageSection'
import { Button } from '@/ui/Button'
import { Icon } from '@/ui/Icon'
import { EmptyState } from '@/ui/EmptyState'
import { getRecipeSearchResults } from '@/mocks'
import { filterRecipes } from '../utils/searchUtils'

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  // Load mock data
  const { results: allRecipes } = getRecipeSearchResults()

  // Memoize filtered recipes to avoid recalculation on every render
  const filteredRecipes = useMemo(() => {
    return filterRecipes(allRecipes, query)
  }, [allRecipes, query])

  // Memoize search handler to prevent unnecessary re-renders
  const handleSearch = useCallback((newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery })
    }
  }, [setSearchParams])

  return (
    <main id="main-content" className="flex-grow">
      {/* Search Section */}
      <PageSection>
        <div className="space-y-4">
          <Button to="/" variant="link" className="inline-flex items-center">
            <Icon name="arrowLeft" className="mr-2" />
            Back to Home
          </Button>
          <SearchBar onSearch={handleSearch} />
        </div>
      </PageSection>

      {/* Results Section */}
      <PageSection as="div">
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
            <EmptyState
              icon="search"
              title="Search for Recipes"
              message="Enter a search term above to find recipes"
            />
          )}
        </div>
      </PageSection>
    </main>
  )
}

