import { RecipeImage } from './RecipeImage'
import { RecipeMetadataGroup } from './RecipeMetadataGroup'

/**
 * RecipeHeader component displaying recipe title, image, and metadata.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Recipe title
 * @param {string} props.image - Recipe image URL
 * @param {number} [props.readyInMinutes] - Preparation time in minutes
 * @param {number} [props.servings] - Number of servings
 * @param {number} [props.calories] - Calories per serving
 * @returns {JSX.Element} RecipeHeader component
 */
export function RecipeHeader({
  title,
  image,
  readyInMinutes,
  servings,
  calories
}) {
  return (
    <header className="space-y-4">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <RecipeImage src={image} alt={title} variant="mobile" />
        <div className="mt-4 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {title}
          </h1>
          <RecipeMetadataGroup
            readyInMinutes={readyInMinutes}
            servings={servings}
            calories={calories}
            variant="mobile"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <RecipeImage
          src={image}
          alt={title}
          variant="desktop"
          overlay={
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                  {title}
                </h1>
                <RecipeMetadataGroup
                  readyInMinutes={readyInMinutes}
                  servings={servings}
                  calories={calories}
                  variant="desktop"
                />
              </div>
            </>
          }
        />
      </div>
    </header>
  )
}

