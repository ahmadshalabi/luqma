import { memo } from 'react'
import { Link } from 'react-router-dom'

/**
 * Button Component
 * 
 * Versatile button component supporting multiple variants and rendering as button, internal link, or external link.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Visual variant (primary, secondary, link)
 * @param {string} props.to - Internal route path (uses React Router Link)
 * @param {string} props.href - External URL
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.ariaLabel - Accessible label
 */
const ButtonComponent = ({
  children,
  variant = 'primary',
  to,
  href,
  className = '',
  type = 'button',
  onClick,
  disabled = false,
  ariaLabel,
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'px-6 py-3 text-base text-white bg-blue-600 border border-transparent rounded-lg shadow-sm transition-colors hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'px-6 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors hover:bg-gray-50 focus:ring-blue-500',
    link: 'px-2 py-1 text-base text-blue-600 transition-colors hover:text-blue-700 focus:ring-blue-500'
  }

  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`

  // Render as React Router Link for internal navigation
  if (to && !disabled) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel} {...rest}>
        {children}
      </Link>
    )
  }

  // Render as anchor for external links
  if (href && !disabled) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} {...rest}>
        {children}
      </a>
    )
  }

  // Render as button
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  )
}

export const Button = memo(ButtonComponent)

