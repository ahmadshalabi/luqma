/**
 * HTTP Client Utility
 * 
 * Centralized HTTP request handler with consistent error handling and headers.
 * Eliminates duplicate fetch logic across API client methods.
 * 
 * @module httpClient
 */

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

/**
 * Custom error class for HTTP errors with enhanced context.
 */
export class HttpError extends Error {
  constructor(message, status, response) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.response = response
  }
}

/**
 * Make an HTTP request with standardized error handling.
 * 
 * @param {string} url - Full URL to request
 * @param {Object} options - Fetch options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.headers] - Additional headers (merged with defaults)
 * @param {Object|string} [options.body] - Request body (auto-stringified if object)
 * @param {AbortSignal} [options.signal] - AbortController signal for cancellation
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {HttpError} If response is not ok
 * @throws {Error} For network errors
 * 
 * @example
 * const data = await httpClient('https://api.example.com/data', {
 *   method: 'POST',
 *   body: { key: 'value' }
 * })
 */
export async function httpClient(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    signal,
    ...restOptions
  } = options

  const mergedHeaders = {
    ...DEFAULT_HEADERS,
    ...headers
  }

  const requestOptions = {
    method,
    headers: mergedHeaders,
    signal,
    ...restOptions
  }

  if (body) {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  try {
    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      await handleErrorResponse(response)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your connection.')
    }

    if (error.name === 'AbortError') {
      throw error
    }

    throw error
  }
}

/**
 * Handle error responses with appropriate error messages.
 * 
 * @param {Response} response - Fetch response object
 * @throws {HttpError} Always throws with appropriate error message
 */
async function handleErrorResponse(response) {
  const status = response.status
  
  let errorData = {}
  try {
    errorData = await response.json()
  } catch {
    // Ignore parse errors
  }

  const errorMessage = errorData.message || getDefaultErrorMessage(status)
  
  throw new HttpError(errorMessage, status, errorData)
}

/**
 * Get default error message based on HTTP status code.
 * 
 * @param {number} status - HTTP status code
 * @returns {string} Error message
 */
function getDefaultErrorMessage(status) {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'
    case 401:
      return 'Authentication required. Please log in.'
    case 403:
      return 'Access forbidden. You do not have permission.'
    case 404:
      return 'Resource not found.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'Server error. Please try again later.'
    case 503:
      return 'Service unavailable. Please try again later.'
    default:
      return `Request failed with status ${status}. Please try again.`
  }
}

/**
 * Helper for GET requests.
 * 
 * @param {string} url - URL to request
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */
export function get(url, options = {}) {
  return httpClient(url, { ...options, method: 'GET' })
}

/**
 * Helper for POST requests.
 * 
 * @param {string} url - URL to request
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */
export function post(url, body, options = {}) {
  return httpClient(url, { ...options, method: 'POST', body })
}

/**
 * Helper for PUT requests.
 * 
 * @param {string} url - URL to request
 * @param {Object} body - Request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */
export function put(url, body, options = {}) {
  return httpClient(url, { ...options, method: 'PUT', body })
}

/**
 * Helper for DELETE requests.
 * 
 * @param {string} url - URL to request
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */
export function del(url, options = {}) {
  return httpClient(url, { ...options, method: 'DELETE' })
}

