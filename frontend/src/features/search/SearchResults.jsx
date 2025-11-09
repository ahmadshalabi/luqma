import { useState, useCallback, useEffect, useRef } from 'react'
import { RecipeGrid } from '@/features/recipe/RecipeGrid'
import { PageSection } from '@/features/layout/PageSection'
import { Pagination } from '@/primitives/Pagination'
import { ResultsHeader } from './ResultsHeader'
import { LoadingState } from '@/primitives/LoadingState'
import { LoadingSpinner } from '@/primitives/LoadingSpinner'
import { MessageState } from '@/primitives/MessageState'
import { searchRecipes } from '@/services/apiClient'
import { useSearchState } from '@/hooks/useSearchState'

const ITEMS_PER_PAGE = 9

/**
 * SearchResults component for displaying recipe search results from the backend API.
 * Supports pagination and real-time search with loading and error states.
 *
 * @param {Object} props
 * @param {string} props.query - The search query to filter recipes
 */
export const SearchResults = ({ query }) => {
  const { page: currentPage, rawPage: pageParam, setSearchParams, updatePage } = useSearchState()
  const resultsRef = useRef(null)
  const previousQueryRef = useRef('')

  const [recipes, setRecipes] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState(null)

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)
  const startItem = totalResults > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalResults)
  
  useEffect(() => {
    if (pageParam !== currentPage.toString() && query) {
      setSearchParams({ q: query, page: currentPage.toString() }, { replace: true })
    }
  }, [pageParam, currentPage, query, setSearchParams])

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setRecipes([])
      setTotalResults(0)
      setIsInitialLoad(true)
      previousQueryRef.current = ''
      return
    }

    const isNewQuery = query !== previousQueryRef.current
    if (isNewQuery) {
      setIsInitialLoad(true)
      previousQueryRef.current = query
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
        setIsInitialLoad(false)

        if (data.totalResults > 0 && data.results.length === 0 && currentPage > 1) {
          setSearchParams({ q: query, page: '1' })
        }
      } catch (err) {
        setError(err.message || 'Failed to load recipes')
        if (isNewQuery) {
          setRecipes([])
          setTotalResults(0)
        }
        setIsInitialLoad(false)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [query, currentPage, setSearchParams])

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
      <LoadingState 
        message="Loading recipes..."
        size="lg"
        wrapper={PageSection}
        wrapperProps={{ as: 'div' }}
      />
    )
  }

  if (error && !loading) {
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
          <MessageState
            variant="error"
            title="Error Loading Results"
            message={error}
          />
        </div>
      </PageSection>
    )
  }

  return (
    <PageSection as="div" ref={resultsRef}>
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
    </PageSection>
  )
}

