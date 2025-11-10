/**
 * LoadingSpinner component for indicating loading state.
 * 
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Spinner size
 * @param {string} [props.text] - Optional text to display
 * @param {boolean} [props.centered=true] - Center the spinner
 * @param {string} [props.className] - Additional CSS classes
 */
export function LoadingSpinner({
  size = 'md',
  text,
  centered = true,
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  const spinner = (
    <div className={`flex items-center gap-3 ${className}`} aria-busy="true">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  )
  
  if (centered) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {spinner}
      </div>
    )
  }
  
  return spinner
}

