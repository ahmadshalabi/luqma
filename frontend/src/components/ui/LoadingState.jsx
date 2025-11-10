import { memo } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

/**
 * LoadingState component wrapper providing consistent loading UI.
 * Wraps LoadingSpinner with container and optional message.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.message='Loading...'] - Loading message
 * @param {string} [props.size='md'] - Spinner size (sm, md, lg)
 * @param {string} [props.minHeight='400px'] - Minimum height of container
 * @param {React.ElementType|string} [props.wrapper='div'] - Wrapper element (string or component)
 * @param {Object} [props.wrapperProps={}] - Props to pass to wrapper
 * @param {string} [props.wrapperClassName=''] - Additional classes for wrapper
 * @param {boolean} [props.centerVertically=true] - Center content vertically
 * @param {string} [props.className=''] - Additional CSS classes for inner container
 * @returns {JSX.Element} LoadingState component
 */
function LoadingStateComponent({ 
  message = 'Loading...', 
  size = 'md',
  minHeight = '400px',
  wrapper: Wrapper = 'div',
  wrapperProps = {},
  wrapperClassName = '',
  centerVertically = true,
  className = ''
}) {
  const containerClasses = centerVertically
    ? `flex flex-col items-center justify-center ${className}`
    : `flex justify-center items-center ${className}`
  
  return (
    <Wrapper className={wrapperClassName} {...wrapperProps}>
      <div 
        className={containerClasses}
        style={{ minHeight }}
      >
        <LoadingSpinner size={size} centered={false} text={message} />
      </div>
    </Wrapper>
  )
}

export const LoadingState = memo(LoadingStateComponent)

