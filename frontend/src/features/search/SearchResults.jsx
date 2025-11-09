import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RecipeGrid } from '@/features/recipe/RecipeGrid'
import { PageSection } from '@/features/layout/PageSection'
import { Pagination } from '@/primitives/Pagination'
import { ResultsHeader } from './ResultsHeader'
import { LoadingSpinner } from '@/primitives/LoadingSpinner'
import { ErrorState } from '@/primitives/ErrorState'
import { searchRecipes } from '@/services/apiClient'

const ITEMS_PER_PAGE = 9

/**
 * SearchResults component for displaying recipe search results from the backend API.
 * Supports pagination and real-time search with loading and error states.
 *
 * @param {Object} props
 * @param {string} props.query - The search query to filter recipes
 */
export const SearchResults = ({ query }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Validate and sanitize page parameter
  const pageParam = searchParams.get('page') || '1'
  const parsedPage = parseInt(pageParam, 10)
  const currentPage = (!isNaN(parsedPage) && parsedPage > 0) ? parsedPage : 1

  // API state management
  const [recipes, setRecipes] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Calculate pagination values
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)
  const startItem = totalResults > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalResults)

  // Correct URL if invalid page parameter was provided
  useEffect(() => {
    if (pageParam !== currentPage.toString() && query) {
      setSearchParams({ q: query, page: currentPage.toString() }, { replace: true })
    }
  }, [pageParam, currentPage, query, setSearchParams])

  // Fetch recipes from API
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      return
    }

    const fetchRecipes = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await searchRecipes({
          query: query.trim(),
          page: currentPage,
          pageSize: ITEMS_PER_PAGE
        })

        setRecipes(data.results || [])
        setTotalResults(data.totalResults || 0)

        // If current page is beyond available results and there are results, redirect to page 1
        if (data.totalResults > 0 && data.results.length === 0 && currentPage > 1) {
          setSearchParams({ q: query, page: '1' })
        }
      } catch (err) {
        setError(err.message || 'Failed to load recipes')
        setRecipes([])
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [query, currentPage, setSearchParams])

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setSearchParams({ q: query, page: newPage.toString() })
  }, [query, setSearchParams])

  // Return null if no query
  if (!query) {
    return null
  }

  // Show loading state
  if (loading) {
    return (
      <PageSection as="div">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" centered={false} text="Loading recipes..." />
        </div>
      </PageSection>
    )
  }

  // Show error state
  if (error) {
    return (
      <PageSection as="div">
        <div className="space-y-6">
          <ResultsHeader
            title={`Search Results for "${query}"`}
            totalCount={0}
            startItem={0}
            endItem={0}
            itemLabel="recipe"
          />
          <ErrorState
            title="Error Loading Results"
            message={error}
          />
        </div>
      </PageSection>
    )
  }

  return (
    <PageSection as="div">
      <div className="space-y-6">
        <ResultsHeader
          title={`Search Results for "${query}"`}
          totalCount={totalResults}
          startItem={startItem}
          endItem={endItem}
          itemLabel="recipe"
        />
        <RecipeGrid
          recipes={recipes}
          emptyTitle="No recipes found"
          emptyMessage="Try adjusting your search or browse our collection"
        />
        {totalResults > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </PageSection>
  )
}

