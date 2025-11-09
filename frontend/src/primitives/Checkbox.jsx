import { memo } from 'react'

/**
 * Checkbox Component
 * 
 * Accessible checkbox primitive with label and consistent styling.
 * Follows WCAG 2.1 AA accessibility standards.
 * 
 * @param {Object} props
 * @param {boolean} props.checked - Checkbox checked state
 * @param {Function} props.onChange - Change event handler
 * @param {string} props.label - Label text for the checkbox
 * @param {string} props.id - Unique ID for the checkbox (required for accessibility)
 * @param {boolean} props.disabled - Disable the checkbox
 * @param {string} props.className - Additional CSS classes
 */
const CheckboxComponent = ({
  checked = false,
  onChange,
  label,
  id,
  disabled = false,
  className = '',
  ...rest
}) => {
  if (!id) {
    console.warn('Checkbox: id prop is required for accessibility')
  }

  const baseClasses = 'h-5 w-5 md:h-4 md:w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  const checkboxClasses = `${baseClasses} ${disabledClasses}`.trim()

  return (
    <div className={`flex items-center min-h-[44px] md:min-h-0 ${className}`.trim()}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={checkboxClasses}
        aria-checked={checked}
        {...rest}
      />
      {label && (
        <label
          htmlFor={id}
          className={`ml-3 md:ml-2 text-base md:text-sm text-gray-700 select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export const Checkbox = memo(CheckboxComponent)

