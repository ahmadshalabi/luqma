import { useCallback } from 'react'
import { SearchBar } from '@/features/search/SearchBar'
import { SearchResults } from '@/features/search/SearchResults'
import { HeroSection } from '@/features/layout/HeroSection'
import { useSearchState } from '@/hooks/useSearchState'

export const HomePage = () => {
  const { query, updateSearch } = useSearchState()

  const handleSearch = useCallback((searchQuery) => {
    updateSearch(searchQuery)
  }, [updateSearch])

  return (
    <main id="main-content" className="flex-grow">
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
    </main>
  )
}
