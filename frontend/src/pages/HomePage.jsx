import { SearchBar } from '../components/SearchBar'
import { PopularRecipes } from '../components/PopularRecipes'
import { getRecipeSearchResults } from '@/mocks'

export const HomePage = () => {
  // Get selected recipes from backend (currently using mock data)
  const { results } = getRecipeSearchResults()
  // Select first 6 recipes as popular recipes
  const popularRecipes = results.slice(0, 6)

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to Luqma
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Discover delicious recipes with nutritional information
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Popular Recipes
          </h2>
          <PopularRecipes recipes={popularRecipes} />
        </div>
      </section>
    </main>
  )
}