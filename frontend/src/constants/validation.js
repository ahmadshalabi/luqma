/**
 * Validation Constants
 * 
 * Centralized constants for form validation and data constraints.
 */

/**
 * Search validation rules
 */
export const SEARCH = {
  /** Minimum query length */
  MIN_QUERY_LENGTH: 1,
  /** Maximum query length */
  MAX_QUERY_LENGTH: 200,
  /** Minimum page number */
  MIN_PAGE: 1,
  /** Maximum page number */
  MAX_PAGE: 1000,
  /** Minimum page size */
  MIN_PAGE_SIZE: 1,
  /** Maximum page size */
  MAX_PAGE_SIZE: 100
}

/**
 * Recipe validation rules
 */
export const RECIPE = {
  /** Minimum recipe ID value */
  MIN_ID: 1,
  /** Maximum recipe title length */
  MAX_TITLE_LENGTH: 200
}

/**
 * Nutrition validation rules
 */
export const NUTRITION = {
  /** Minimum calorie value */
  MIN_CALORIES: 0,
  /** Maximum calorie value for sanity check */
  MAX_CALORIES: 10000,
  /** Decimal places for nutrient display */
  DECIMAL_PLACES: 1
}

/**
 * Error messages for validation
 */
export const VALIDATION_MESSAGES = {
  SEARCH_REQUIRED: 'Search query is required',
  SEARCH_TOO_LONG: `Search query must be less than ${SEARCH.MAX_QUERY_LENGTH} characters`,
  PAGE_INVALID: 'Page number must be a positive integer',
  PAGE_SIZE_INVALID: 'Page size must be between 1 and 100',
  RECIPE_ID_INVALID: 'Recipe ID must be a positive integer',
  INGREDIENT_REQUIRED: 'At least one ingredient must be selected'
}

