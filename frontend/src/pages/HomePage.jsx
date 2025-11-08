import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { PopularRecipes } from '../components/PopularRecipes'
import { HeroSection } from '@/ui/HeroSection'
import { PageSection } from '@/ui/PageSection'
import { getPopularRecipes } from '@/mocks'

export const HomePage = () => {
  const navigate = useNavigate()

  // Get popular recipes from mock data
  const popularRecipes = getPopularRecipes()

  // Memoize search handler to prevent unnecessary re-renders
  const handleSearch = useCallback((query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }, [navigate])

  return (
    <main id="main-content" className="flex-grow">
      {/* Hero Section */}
      <HeroSection
        title="Welcome to Luqma"
        description="Discover delicious recipes with nutritional information"
      >
        <SearchBar onSearch={handleSearch} />
      </HeroSection>

      {/* Popular Recipes Section */}
      <PageSection>
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Popular Recipes
          </h2>
          <PopularRecipes recipes={popularRecipes} />
        </div>
      </PageSection>
    </main>
  )
}
