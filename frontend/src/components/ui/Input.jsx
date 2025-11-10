import { useId } from 'react'
import { Icon } from '@/utils/iconRegistry'

/**
 * Input component for flexible form inputs with labels, icons, and validation states.
 * 
 * @param {Object} props
 * @param {string} [props.type='text'] - Input type (text, search, email, password, number, tel, url)
 * @param {string} [props.label] - Input label (visible or sr-only)
 * @param {boolean} [props.labelVisible=true] - Show label visibly (false for sr-only)
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.value] - Controlled input value
 * @param {Function} [props.onChange] - Change handler
 * @param {string} [props.leftIcon] - Left icon name from icon registry
 * @param {string} [props.rightIcon] - Right icon name from icon registry
 * @param {Function} [props.onRightIconClick] - Right icon click handler (makes icon button)
 * @param {string} [props.error] - Error message (shows error state)
 * @param {string} [props.helperText] - Helper text below input
 * @param {boolean} [props.disabled=false] - Disable input
 * @param {boolean} [props.required=false] - Mark as required
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Input size
 * @param {boolean} [props.fullWidth=false] - Make input full width
 * @param {string} [props.name] - Input name attribute
 * @param {string} [props.id] - Custom input ID
 * @param {string} [props.className] - Additional CSS classes
 */
export function Input({
  type = 'text',
  label,
  labelVisible = true,
  placeholder,
  value,
  onChange,
  leftIcon,
  rightIcon,
  onRightIconClick,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'md',
  fullWidth = false,
  name,
  id,
  className = '',
  ...rest
}) {
  const autoId = useId()
  const inputId = id || autoId
  const errorId = `${inputId}-error`
  const helperTextId = `${inputId}-helper`
  
  const baseClasses = 'w-full text-gray-900 placeholder-gray-500 bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-base',
    lg: 'py-4 text-lg'
  }
  
  // Padding adjustments for icons
  const leftPadding = leftIcon ? (size === 'sm' ? 'pl-10' : size === 'md' ? 'pl-12' : 'pl-14') : 'pl-4'
  const rightPadding = rightIcon ? (size === 'sm' ? 'pr-10' : size === 'md' ? 'pr-12' : 'pr-14') : 'pr-4'
  
  const stateClasses = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${leftPadding}
    ${rightPadding}
    ${stateClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const iconPositionClasses = size === 'sm' ? 'top-2.5' : size === 'md' ? 'top-3.5' : 'top-4.5'
  
  return (
    <div className={widthClass}>
      {label && (
        <label
          htmlFor={inputId}
          className={labelVisible ? 'block text-sm font-medium text-gray-700 mb-1.5' : 'sr-only'}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={`absolute left-0 ${iconPositionClasses} flex items-center pl-4 pointer-events-none`}>
            <Icon name={leftIcon} className={`${iconSize} text-gray-400`} aria-hidden="true" />
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
          {...rest}
        />
        
        {rightIcon && (
          onRightIconClick ? (
            <button
              type="button"
              onClick={onRightIconClick}
              className={`absolute right-0 ${iconPositionClasses} flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors`}
              tabIndex={-1}
            >
              <Icon name={rightIcon} className={iconSize} />
            </button>
          ) : (
            <div className={`absolute right-0 ${iconPositionClasses} flex items-center pr-4 pointer-events-none`}>
              <Icon name={rightIcon} className={`${iconSize} text-gray-400`} aria-hidden="true" />
            </div>
          )
        )}
      </div>
      
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={helperTextId} className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

