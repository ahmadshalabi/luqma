/**
 * Color utility functions for consistent color theming across components.
 * 
 * Provides centralized color class definitions for different color variants
 * and contexts (background, text, border, gradients).
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
  blue: {
    bg100: 'bg-blue-100',
    bgFrom: 'from-blue-50',
    bgTo: 'to-blue-100',
    border: 'border-blue-300',
    textPrimary: 'text-blue-600',
    textSecondary: 'text-blue-500'
  },
  green: {
    bg100: 'bg-green-100',
    bgFrom: 'from-green-50',
    bgTo: 'to-green-100',
    border: 'border-green-300',
    textPrimary: 'text-green-600',
    textSecondary: 'text-green-500'
  },
  purple: {
    bg100: 'bg-purple-100',
    bgFrom: 'from-purple-50',
    bgTo: 'to-purple-100',
    border: 'border-purple-300',
    textPrimary: 'text-purple-600',
    textSecondary: 'text-purple-500'
  },
  red: {
    bg100: 'bg-red-100',
    bgFrom: 'from-red-50',
    bgTo: 'to-red-100',
    border: 'border-red-300',
    textPrimary: 'text-red-600',
    textSecondary: 'text-red-500'
  },
  yellow: {
    bg100: 'bg-yellow-100',
    bgFrom: 'from-yellow-50',
    bgTo: 'to-yellow-100',
    border: 'border-yellow-300',
    textPrimary: 'text-yellow-600',
    textSecondary: 'text-yellow-500'
  },
  indigo: {
    bg100: 'bg-indigo-100',
    bgFrom: 'from-indigo-50',
    bgTo: 'to-indigo-100',
    border: 'border-indigo-300',
    textPrimary: 'text-indigo-600',
    textSecondary: 'text-indigo-500'
  },
  gray: {
    bg100: 'bg-gray-100',
    bgFrom: 'from-gray-50',
    bgTo: 'to-gray-100',
    border: 'border-gray-300',
    textPrimary: 'text-gray-600',
    textSecondary: 'text-gray-500'
  },
  orange: {
    bg100: 'bg-orange-100',
    bgFrom: 'from-orange-50',
    bgTo: 'to-orange-100',
    border: 'border-orange-300',
    textPrimary: 'text-orange-600',
    textSecondary: 'text-orange-500'
  },
  pink: {
    bg100: 'bg-pink-100',
    bgFrom: 'from-pink-50',
    bgTo: 'to-pink-100',
    border: 'border-pink-300',
    textPrimary: 'text-pink-600',
    textSecondary: 'text-pink-500'
  }
}

/**
 * Get Tailwind CSS color classes for a given color variant.
 * 
 * @param {string} color - Color variant (blue, green, purple, red, yellow, indigo, gray, orange, pink)
 * @returns {Object} Object containing color classes (bg100, bgFrom, bgTo, border, textPrimary, textSecondary)
 * 
 * @example
 * const { textPrimary } = getColorClasses('blue')
 * // textPrimary = 'text-blue-600'
 * 
 * @example
 * const { bg100, border } = getColorClasses('green')
 * // bg100 = 'bg-green-100', border = 'border-green-300'
 * 
 * @example
 * // Defaults to blue if invalid color provided
 * getColorClasses('invalid') // Returns blue color classes
 */
export function getColorClasses(color) {
  return COLOR_CLASSES[color] || COLOR_CLASSES.blue
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

