import { RecipeMetadataBadge } from '@/primitives/RecipeMetadataBadge'
import { useImageFallback } from '@/hooks/useImageFallback'

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
  const displayImage = image || '/vite.svg'
  const { handleImageError } = useImageFallback()

  const renderMetadata = (variant = 'mobile') => {
    if (!readyInMinutes && !servings && !calories) return null

    return (
      <div className="flex flex-wrap gap-2 md:gap-3">
        {readyInMinutes && readyInMinutes > 0 && (
          <RecipeMetadataBadge icon="clock" variant={variant}>
            {readyInMinutes} min
          </RecipeMetadataBadge>
        )}

        {servings && servings > 0 && (
          <RecipeMetadataBadge icon="users" variant={variant}>
            {servings} {servings === 1 ? 'serving' : 'servings'}
          </RecipeMetadataBadge>
        )}

        {calories && calories > 0 && (
          <RecipeMetadataBadge icon="chartBar" variant={variant}>
            {Math.round(calories)} cal
          </RecipeMetadataBadge>
        )}
      </div>
    )
  }

  return (
    <header className="space-y-4">
      <div className="md:hidden">
        <div className="relative w-full aspect-[16/9] max-h-[250px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
          <img
            src={displayImage}
            alt={title}
            loading="eager"
            className="w-full h-full object-cover object-center"
            style={{ imageRendering: 'auto' }}
            onError={handleImageError}
          />
        </div>
        <div className="mt-4 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {title}
          </h1>
          {renderMetadata('mobile')}
        </div>
      </div>

      <div className="hidden md:block">
        <div className="relative w-full aspect-[16/9] max-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl">
          <img
            src={displayImage}
            alt={title}
            loading="eager"
            className="w-full h-full object-cover object-center"
            style={{ imageRendering: 'auto' }}
            onError={handleImageError}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
              {title}
            </h1>
            {renderMetadata('desktop')}
          </div>
        </div>
      </div>
    </header>
  )
}

