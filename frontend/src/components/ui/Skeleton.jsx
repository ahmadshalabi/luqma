/**
 * Skeleton Component
 * 
 * Base skeleton loader for indicating loading state with better perceived performance.
 * 
 * @param {Object} props
 * @param {'text'|'circle'|'rect'} [props.variant='rect'] - Skeleton variant
 * @param {string} [props.width='100%'] - Width (CSS value)
 * @param {string} [props.height] - Height (CSS value)
 * @param {string} [props.className] - Additional CSS classes
 */
export function Skeleton({
  variant = 'rect',
  width = '100%',
  height,
  className = ''
}) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'
  
  const variantClasses = {
    text: 'rounded h-4',
    circle: 'rounded-full',
    rect: 'rounded-lg'
  }

  const defaultHeights = {
    text: '1rem',
    circle: height || width,
    rect: height || '4rem'
  }

  const style = {
    width,
    height: height || defaultHeights[variant]
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

/**
 * RecipeCardSkeleton - Skeleton for recipe card
 */
export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Image skeleton */}
      <Skeleton variant="rect" height="200px" className="rounded-none" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="80%" height="1.25rem" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  )
}

/**
 * RecipeGridSkeleton - Skeleton for recipe grid
 */
export function RecipeGridSkeleton({ count = 9 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  )
}

