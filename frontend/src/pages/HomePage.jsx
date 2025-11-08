import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchBar } from '@/features/search/SearchBar'
import { SearchResults } from '@/features/search/SearchResults'
import { HeroSection } from '@/features/layout/HeroSection'

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  // Handle live search (debounced)
  const handleSearchChange = useCallback((searchQuery) => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery, page: '1' })
    } else {
      setSearchParams({})
    }
  }, [])

  // Handle form submit (Enter key)
  const handleSearchSubmit = useCallback((searchQuery) => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery, page: '1' })
    }
  }, [])

  return (
    <main id="main-content" className="flex-grow">
      {/* Hero Section */}
      <HeroSection
        title="Welcome to Luqma"
        description="Discover delicious recipes with nutritional information"
      >
        <SearchBar 
          initialQuery={query}
          onSearch={handleSearchSubmit}
          onChange={handleSearchChange}
        />
      </HeroSection>

      {/* Search Results Section */}
      <SearchResults query={query} />
    </main>
  )
}
