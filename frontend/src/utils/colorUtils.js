/**
 * Color utility functions for consistent color theming across components.
 * 
 * Provides centralized color class definitions for different color variants
 * and contexts (background, text, border, etc.).
 * 
 * @module colorUtils
 */

export const COLOR_VARIANTS = {
  blue: 'blue',
  green: 'green',
  purple: 'purple',
  red: 'red',
  yellow: 'yellow',
  indigo: 'indigo',
  gray: 'gray',
  orange: 'orange',
  pink: 'pink'
}

const COLOR_CLASSES = {
  combined: {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    gray: 'bg-gray-100 text-gray-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600'
  },
  background: {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    indigo: 'bg-indigo-100',
    gray: 'bg-gray-100',
    orange: 'bg-orange-100',
    pink: 'bg-pink-100'
  },
  text: {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    gray: 'text-gray-600',
    orange: 'text-orange-600',
    pink: 'text-pink-600'
  },
  border: {
    blue: 'border-blue-300',
    green: 'border-green-300',
    purple: 'border-purple-300',
    red: 'border-red-300',
    yellow: 'border-yellow-300',
    indigo: 'border-indigo-300',
    gray: 'border-gray-300',
    orange: 'border-orange-300',
    pink: 'border-pink-300'
  }
}

/**
 * Get Tailwind CSS color classes for a given color variant and context.
 * 
 * @param {string} color - Color variant (blue, green, purple, red, yellow, indigo, gray, orange, pink)
 * @param {string} context - Context type (combined, background, text, border)
 * @returns {string} Tailwind CSS classes for the color
 * 
 * @example
 * // Get combined background and text classes
 * getColorClasses('blue', 'combined') // Returns 'bg-blue-100 text-blue-600'
 * 
 * @example
 * // Get only text classes
 * getColorClasses('green', 'text') // Returns 'text-green-600'
 * 
 * @example
 * // Defaults to blue if invalid color provided
 * getColorClasses('invalid', 'combined') // Returns 'bg-blue-100 text-blue-600'
 */
export function getColorClasses(color, context = 'combined') {
  const contextMap = COLOR_CLASSES[context] || COLOR_CLASSES.combined
  return contextMap[color] || contextMap.blue
}

/**
 * Check if a color variant is valid.
 * 
 * @param {string} color - Color variant to validate
 * @returns {boolean} True if the color variant is valid
 * 
 * @example
 * isValidColor('blue') // Returns true
 * isValidColor('invalid') // Returns false
 */
export function isValidColor(color) {
  return Object.values(COLOR_VARIANTS).includes(color)
}

/**
 * Get all available color variants.
 * 
 * @returns {string[]} Array of color variant names
 */
export function getAvailableColors() {
  return Object.values(COLOR_VARIANTS)
}

