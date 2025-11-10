import { useCallback, useEffect, useRef } from 'react'
import { RecipeGrid } from '../recipe-display/card/RecipeGrid'
import { Container } from '../layout/Container'
import { Pagination } from './Pagination'
import { ResultsHeader } from './ResultsHeader'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { Alert } from '../ui/Alert'
import { useSearchState } from '@/hooks/useSearchState'
import { useSearchRecipes } from '@/hooks/useSearchRecipes'

const ITEMS_PER_PAGE = 9

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

  if (!query) {
    return null
  }

  if (loading && isInitialLoad) {
    return (
      <Container as="div">
        <LoadingSpinner size="lg" text="Loading recipes..." />
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
            message={error}
          />
        </div>
      </Container>
    )
  }

  return (
    <Container as="div" ref={resultsRef}>
      <div className="space-y-6 relative">
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

