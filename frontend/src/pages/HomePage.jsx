import { useCallback } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { HeroSection } from '@/components/layout/HeroSection'
import { useSearchState } from '@/hooks/useSearchState'

export function HomePage() {
  const { query, updateSearch } = useSearchState()

  const handleSearch = useCallback((searchQuery) => {
    updateSearch(searchQuery)
  }, [updateSearch])

  return (
    <>
      <HeroSection
        title="Welcome to Luqma"
        description="Discover delicious recipes with nutritional information"
      >
        <SearchBar 
          initialQuery={query}
          onSearch={handleSearch}
          onChange={handleSearch}
        />
      </HeroSection>

      <SearchResults query={query} />
    </>
  )
}
