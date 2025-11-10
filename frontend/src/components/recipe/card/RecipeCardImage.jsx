import { Icon } from '@/utils/iconRegistry'

/**
 * RecipeCardImage primitive component for displaying recipe image.
 * Presentational component with error handling.
 * 
 * @param {Object} props
 * @param {string} props.src - Image URL
 * @param {string} props.alt - Image alt text
 * @param {boolean} props.hasError - Error state
 * @param {Function} props.onError - Error handler
 */
export function RecipeCardImage({ src, alt, hasError, onError }) {
  return (
    <div className="relative w-full h-48 bg-gray-100">
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <Icon name="image" className="w-16 h-16" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          width="312"
          height="192"
          onError={onError}
        />
      )}
    </div>
  )
}

