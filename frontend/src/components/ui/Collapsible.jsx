import { useState, useEffect, useRef } from 'react'
import { Icon } from '@/utils/iconRegistry'
import { IconBox } from './IconBox'

/**
 * Collapsible component for expandable/collapsible content sections.
 * Generalized from CollapsibleNutrition with smooth animations.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - Trigger element (button content or custom component)
 * @param {React.ReactNode} props.children - Collapsible content
 * @param {boolean} [props.defaultExpanded=false] - Initial expanded state
 * @param {boolean} [props.controlled=false] - Use controlled state (requires isExpanded and onToggle)
 * @param {boolean} [props.isExpanded] - Controlled expanded state
 * @param {Function} [props.onToggle] - Controlled toggle handler
 * @param {boolean} [props.showChevron=true] - Show chevron indicator
 * @param {string} [props.triggerClassName] - Custom trigger button classes
 * @param {string} [props.contentClassName] - Custom content classes
 * @param {string} [props.className] - Container classes
 * @param {string} [props.id] - Custom ID for aria-controls
 */
export function Collapsible({
  trigger,
  children,
  defaultExpanded = false,
  controlled = false,
  isExpanded: controlledIsExpanded,
  onToggle: controlledOnToggle,
  showChevron = true,
  triggerClassName = '',
  contentClassName = '',
  className = '',
  id,
  ...rest
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef(null)
  
  // Use controlled or internal state
  const isExpanded = controlled ? controlledIsExpanded : internalExpanded
  const setIsExpanded = controlled ? controlledOnToggle : setInternalExpanded
  
  // Update height when content or expanded state changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [children, isExpanded])
  
  // Update height on window resize
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }
    
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])
  
  const handleToggle = () => {
    if (controlled && controlledOnToggle) {
      controlledOnToggle(!isExpanded)
    } else {
      setIsExpanded(!isExpanded)
    }
  }
  
  const contentId = id || 'collapsible-content'
  
  const defaultTriggerClasses = 'w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-t-lg'
  const triggerClasses = triggerClassName || defaultTriggerClasses
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`} {...rest}>
      <button
        onClick={handleToggle}
        className={triggerClasses}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        type="button"
      >
        <div className="flex-1 text-left">
          {trigger}
        </div>
        
        {showChevron && (
          <Icon 
            name="chevronDown"
            className={`w-5 h-5 text-gray-400 transition-transform duration-[600ms] flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            aria-hidden="true"
          />
        )}
      </button>
      
      <div
        id={contentId}
        className={`overflow-hidden ${contentClassName}`}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0',
          opacity: isExpanded ? 1 : 0,
          transition: 'max-height 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * CollapsibleTrigger - Helper component for consistent trigger styling
 */
export function CollapsibleTrigger({ icon, title, subtitle, badge, iconColor = 'blue' }) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <IconBox icon={icon} color={iconColor} size="md" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * CollapsibleContent - Helper component for consistent content styling
 */
export function CollapsibleContent({ children, className = '' }) {
  return (
    <div className={`p-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

