/**
 * API Constants
 * 
 * Centralized constants for API configuration and behavior.
 */

/**
 * HTTP request timeout in milliseconds
 * @constant {number}
 */
export const HTTP_TIMEOUT = 30000 // 30 seconds

/**
 * Maximum number of retry attempts for failed requests
 * @constant {number}
 */
export const MAX_RETRIES = 3

/**
 * Initial delay for exponential backoff in milliseconds
 * @constant {number}
 */
export const INITIAL_RETRY_DELAY = 1000 // 1 second

/**
 * Maximum delay for exponential backoff in milliseconds
 * @constant {number}
 */
export const MAX_RETRY_DELAY = 10000 // 10 seconds

/**
 * HTTP status codes that should trigger a retry
 * @constant {number[]}
 */
export const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504]

/**
 * Debounce delay for search input in milliseconds
 * @constant {number}
 */
export const SEARCH_DEBOUNCE_DELAY = 300

