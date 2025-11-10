import { useCallback, useEffect, useRef } from 'react'
import { RecipeGrid } from '../recipe/card/RecipeGrid'
import { Container } from '../layout/Container'
import { Pagination } from './Pagination'
import { ResultsHeader } from './ResultsHeader'
import { Alert } from '../ui/Alert'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { StatusRegion } from '../ui/LiveRegion'
import { RecipeGridSkeleton } from '../ui/Skeleton'
import { useSearchState } from '@/hooks/useSearchState'
import { useSearchRecipes } from '@/hooks/useSearchRecipes'
import { PAGINATION } from '@/constants/ui'

const ITEMS_PER_PAGE = PAGINATION.DEFAULT_PAGE_SIZE

/**
 * SearchResults component for displaying recipe search results.
 * Supports pagination and real-time search with loading and error states.
 *
 * @param {Object} props
 * @param {string} props.query - The search query to filter recipes
 */
export function SearchResults({ query }) {
  const { page: currentPage, rawPage: pageParam, setSearchParams, updatePage } = useSearchState()
  const resultsRef = useRef(null)

  const { recipes, totalResults, loading, isInitialLoad, error } = useSearchRecipes({
    query,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE
  })

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)
  const startItem = totalResults > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalResults)
  
  useEffect(() => {
    if (pageParam !== currentPage.toString() && query) {
      setSearchParams({ q: query, page: currentPage.toString() }, { replace: true })
    }
  }, [pageParam, currentPage, query, setSearchParams])

  useEffect(() => {
    if (!loading && resultsRef.current && currentPage > 1 && recipes.length > 0) {
      requestAnimationFrame(() => {
        const headerHeight = 64
        const yOffset = -headerHeight - 20
        const element = resultsRef.current
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        
        window.scrollTo({ top: y, behavior: 'smooth' })
      })
    }
  }, [loading, currentPage, recipes.length])

  const handlePageChange = useCallback((newPage) => {
    updatePage(newPage)
  }, [updatePage])
  
  const handleRetry = useCallback(() => {
    // Trigger a re-fetch by updating the page (same page will refetch)
    updatePage(currentPage)
  }, [currentPage, updatePage])

  if (!query) {
    return null
  }

  if (loading && isInitialLoad) {
    return (
      <Container as="div">
        <div className="space-y-6">
          <div className="text-center">
            <StatusRegion visible={true}>
              <p className="text-gray-600">Loading recipes...</p>
            </StatusRegion>
          </div>
          <RecipeGridSkeleton count={ITEMS_PER_PAGE} />
        </div>
      </Container>
    )
  }

  if (error && !loading) {
    return (
      <Container as="div">
        <div className="space-y-6">
          <ResultsHeader
            title={`Search Results for "${query}"`}
            totalCount={0}
            startItem={0}
            endItem={0}
            itemLabel="recipe"
          />
          <Alert
            variant="error"
            title="Error Loading Results"
            message={`${error} Please check your connection and try again.`}
            action={
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry Search
              </button>
            }
          />
        </div>
      </Container>
    )
  }

  return (
    <Container as="div" ref={resultsRef}>
      <div className="space-y-6 relative">
        {/* Screen reader announcement for search results */}
        <StatusRegion>
          {!loading && totalResults > 0 && 
            `Found ${totalResults} ${totalResults === 1 ? 'recipe' : 'recipes'} for "${query}". Showing ${startItem} to ${endItem}.`
          }
          {!loading && totalResults === 0 && 
            `No recipes found for "${query}".`
          }
        </StatusRegion>
        
        <ResultsHeader
          title={`Search Results for "${query}"`}
          totalCount={totalResults}
          startItem={startItem}
          endItem={endItem}
          itemLabel="recipe"
        />
        <div className="relative">
          <RecipeGrid
            recipes={recipes}
            emptyTitle="No recipes found"
            emptyMessage="Try adjusting your search or browse our collection"
          />
          {loading && !isInitialLoad && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <LoadingSpinner size="md" text="Loading..." centered={false} />
            </div>
          )}
        </div>
        {totalResults > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Container>
  )
}

