import { RecipeCard } from './RecipeCard'
import { getRecipeSearchResults } from '@/mocks'

export const SearchResults = () => {
  const { results } = getRecipeSearchResults()

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4" role="status">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
        <p className="text-base text-gray-600 text-center">
          Try adjusting your search or browse our collection
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

