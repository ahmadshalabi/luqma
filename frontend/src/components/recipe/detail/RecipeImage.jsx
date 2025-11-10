import { useImageFallback } from '@/hooks/useImageFallback'

/**
 * RecipeImage component for displaying recipe image.
 * Presentational component with fallback handling.
 * 
 * @param {Object} props
 * @param {string} props.src - Image URL
 * @param {string} props.alt - Image alt text
 * @param {'mobile'|'desktop'} [props.variant='mobile'] - Display variant
 * @param {React.ReactNode} [props.overlay] - Overlay content (for desktop)
 */
export function RecipeImage({ src, alt, variant = 'mobile', overlay }) {
  const displayImage = src || '/vite.svg'
  const { handleImageError } = useImageFallback()

  const containerClasses = {
    mobile: 'relative w-full aspect-[16/9] max-h-[250px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl',
    desktop: 'relative w-full aspect-[16/9] max-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl'
  }

  return (
    <div className={containerClasses[variant]}>
      <img
        src={displayImage}
        alt={alt}
        loading="eager"
        className="w-full h-full object-cover object-center"
        style={{ imageRendering: 'auto' }}
        onError={handleImageError}
      />
      {overlay}
    </div>
  )
}

