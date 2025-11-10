import { useCallback, useRef } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { HeroSection } from '@/components/layout/HeroSection'
import { useSearchState } from '@/hooks/useSearchState'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardNavigation'

export function HomePage() {
  const { query, updateSearch } = useSearchState()
  const searchInputRef = useRef(null)

  const handleSearch = useCallback((searchQuery) => {
    updateSearch(searchQuery)
  }, [updateSearch])

  // Keyboard shortcut: Press '/' to focus search
  useKeyboardShortcuts({
    '/': () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }
  })

  return (
    <>
      <HeroSection
        title="Welcome to Luqma"
        description="Discover delicious recipes with nutritional information"
      >
        <SearchBar 
          ref={searchInputRef}
          initialQuery={query}
          onSearch={handleSearch}
          onChange={handleSearch}
        />
      </HeroSection>

      <SearchResults query={query} />
    </>
  )
}
