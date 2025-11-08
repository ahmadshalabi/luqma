import { useMemo, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { SearchResults } from '../components/SearchResults'
import { PageSection } from '@/ui/PageSection'
import { Button } from '@/ui/Button'
import { Icon } from '@/ui/Icon'
import { EmptyState } from '@/ui/EmptyState'
import { Pagination } from '@/ui/Pagination'
import { getRecipeSearchResults } from '@/mocks'
import { filterRecipes } from '../utils/searchUtils'

const ITEMS_PER_PAGE = 12

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const pageParam = searchParams.get('page')
  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1

  // Load mock data
  const { results: allRecipes } = getRecipeSearchResults()

  // Track previous query to detect actual changes
  const prevQueryRef = useRef(query)

  // Memoize filtered recipes to avoid recalculation on every render
  const filteredRecipes = useMemo(() => {
    return filterRecipes(allRecipes, query)
  }, [allRecipes, query])

  // Calculate pagination values
  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE)
  const validPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages))
  
  // Slice recipes for current page
  const paginatedRecipes = useMemo(() => {
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredRecipes.slice(startIndex, endIndex)
  }, [filteredRecipes, validPage])

  // Calculate display range
  const startItem = filteredRecipes.length > 0 ? (validPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const endItem = Math.min(validPage * ITEMS_PER_PAGE, filteredRecipes.length)

  // Reset to page 1 when query actually changes (not on initial load)
  useEffect(() => {
    if (query && query !== prevQueryRef.current && currentPage !== 1) {
      setSearchParams({ q: query, page: '1' })
    }
    prevQueryRef.current = query
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]) // Only depend on query to detect changes

  // Redirect to valid page if current page is invalid
  useEffect(() => {
    if (filteredRecipes.length > 0 && currentPage !== validPage) {
      setSearchParams({ q: query, page: validPage.toString() })
    }
  }, [currentPage, validPage, query, filteredRecipes.length, setSearchParams])

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [validPage])

  // Memoize search handler to prevent unnecessary re-renders
  const handleSearch = useCallback((newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery, page: '1' })
    }
  }, [setSearchParams])

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setSearchParams({ q: query, page: newPage.toString() })
  }, [query, setSearchParams])

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
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Search Results for &ldquo;{query}&rdquo;
                </h1>
                <div className="flex flex-col sm:items-end gap-1">
                  <p className="text-sm text-gray-600">
                    {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
                  </p>
                  {filteredRecipes.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Showing {startItem}-{endItem} of {filteredRecipes.length}
                    </p>
                  )}
                </div>
              </div>
              <SearchResults recipes={paginatedRecipes} />
              {filteredRecipes.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={validPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
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

