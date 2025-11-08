import { RecipeGrid } from './RecipeGrid'

/**
 * SearchResults component displays search results in a grid.
 * 
 * @param {Object} props
 * @param {Array} props.recipes - Array of recipe objects to display
 */
export const SearchResults = ({ recipes = [] }) => {
  return (
    <RecipeGrid
      recipes={recipes}
      emptyTitle="No recipes found"
      emptyMessage="Try adjusting your search or browse our collection"
    />
  )
}

