import { useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RecipeGrid } from '@/features/recipe/RecipeGrid'
import { PageSection } from '@/features/layout/PageSection'
import { Pagination } from '@/primitives/Pagination'
import { ResultsHeader } from './ResultsHeader'
import { usePagination } from '@/hooks/usePagination'
import { getRecipeSearchResults } from '@/mocks'
import { filterRecipes } from '@/utils/searchUtils'

const ITEMS_PER_PAGE = 9

/**
 * SearchResults component for displaying filtered and paginated recipe search results.
 *
 * @param {Object} props
 * @param {string} props.query - The search query to filter recipes
 */
export const SearchResults = ({ query }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  // Load mock data
  const { results: allRecipes } = getRecipeSearchResults()

  // Memoize filtered recipes to avoid recalculation on every render
  const filteredRecipes = useMemo(() => {
    return filterRecipes(allRecipes, query)
  }, [allRecipes, query])

  // Use pagination hook for calculations
  const {
    paginatedItems: paginatedRecipes,
    totalPages,
    validPage,
    startItem,
    endItem
  } = usePagination({
    items: filteredRecipes,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  })

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

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setSearchParams({ q: query, page: newPage.toString() })
  }, [query, setSearchParams])

  // Return null if no query
  if (!query) {
    return null
  }

  return (
    <PageSection as="div">
      <div className="space-y-6">
        <ResultsHeader
          title={`Search Results for "${query}"`}
          totalCount={filteredRecipes.length}
          startItem={startItem}
          endItem={endItem}
          itemLabel="recipe"
        />
        <RecipeGrid
          recipes={paginatedRecipes}
          emptyTitle="No recipes found"
          emptyMessage="Try adjusting your search or browse our collection"
        />
        {filteredRecipes.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={validPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </PageSection>
  )
}

