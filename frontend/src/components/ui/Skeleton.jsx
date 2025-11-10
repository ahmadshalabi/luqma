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

/**
 * RecipeDetailSkeleton - Skeleton for recipe detail page
 */
export function RecipeDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton variant="rect" height="400px" />
        <Skeleton variant="text" width="70%" height="2rem" />
        <div className="flex gap-4">
          <Skeleton variant="text" width="100px" />
          <Skeleton variant="text" width="100px" />
          <Skeleton variant="text" width="120px" />
        </div>
      </div>

      {/* Nutrition skeleton */}
      <Skeleton variant="rect" height="120px" />

      {/* Ingredients and instructions skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Skeleton variant="rect" height="300px" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Skeleton variant="rect" height="400px" />
        </div>
      </div>
    </div>
  )
}

/**
 * ListSkeleton - Skeleton for lists
 */
export function ListSkeleton({ items = 5, spacing = 'space-y-3' }) {
  return (
    <div className={spacing}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton variant="circle" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
          </div>
        </div>
      ))}
    </div>
  )
}

