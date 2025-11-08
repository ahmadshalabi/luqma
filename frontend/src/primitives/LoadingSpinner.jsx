import { memo } from 'react'

/**
 * LoadingSpinner Component
 * 
 * Displays a loading spinner with optional text.
 * 
 * @param {Object} props
 * @param {string} props.size - Size variant (sm, md, lg)
 * @param {string} props.text - Loading text
 * @param {boolean} props.centered - Whether to center in viewport
 */
const LoadingSpinnerComponent = ({ size = 'md', text = 'Loading...', centered = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  }

  const spinnerClass = sizeClasses[size] || sizeClasses.md
  const containerClass = centered ? 'flex items-center justify-center min-h-screen' : 'flex items-center justify-center'

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className="flex flex-col items-center space-y-4">
        <div
          className={`${spinnerClass} border-blue-600 border-t-transparent rounded-full animate-spin`}
          aria-hidden="true"
        />
        {text && <p className="text-base text-gray-600">{text}</p>}
      </div>
    </div>
  )
}

export const LoadingSpinner = memo(LoadingSpinnerComponent)

