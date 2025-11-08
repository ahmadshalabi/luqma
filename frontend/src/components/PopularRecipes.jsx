import PropTypes from 'prop-types'
import { RecipeGrid } from './RecipeGrid'

/**
 * PopularRecipes Component
 * 
 * Displays a grid of popular recipe cards.
 * 
 * @param {Object} props
 * @param {Array} props.recipes - Array of recipe objects to display
 */
export const PopularRecipes = ({ recipes }) => {
  return (
    <RecipeGrid
      recipes={recipes}
      emptyTitle="No popular recipes yet"
      emptyMessage="Check back soon for our curated collection of popular recipes"
    />
  )
}

PopularRecipes.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
}

