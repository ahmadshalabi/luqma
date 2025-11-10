/**
 * HTTP Client Utility
 * 
 * Centralized HTTP request handler with consistent error handling and headers.
 * Features:
 * - Automatic retry with exponential backoff
 * - Request timeout support
 * - Request deduplication
 * - Comprehensive error handling
 * 
 * @module httpClient
 */

import { 
  HTTP_TIMEOUT, 
  MAX_RETRIES, 
  INITIAL_RETRY_DELAY, 
  MAX_RETRY_DELAY, 
  RETRYABLE_STATUS_CODES 
} from '@/constants/api'
import { logger } from './logger'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// Request deduplication cache
const pendingRequests = new Map()

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
 * Calculate exponential backoff delay with jitter.
 * 
 * @param {number} retryCount - Current retry attempt (0-indexed)
 * @returns {number} Delay in milliseconds
 */
function calculateBackoffDelay(retryCount) {
  const exponentialDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
  const jitter = Math.random() * 0.3 * exponentialDelay // Add up to 30% jitter
  return Math.min(exponentialDelay + jitter, MAX_RETRY_DELAY)
}

/**
 * Check if an error/status is retryable.
 * 
 * @param {Error|HttpError} error - Error object
 * @param {number} [status] - HTTP status code
 * @returns {boolean} True if retryable
 */
function isRetryable(error, status) {
  // Network errors are retryable
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true
  }
  
  // Specific HTTP status codes are retryable
  if (status && RETRYABLE_STATUS_CODES.includes(status)) {
    return true
  }
  
  // Don't retry AbortErrors or other errors
  return false
}

/**
 * Sleep for specified milliseconds.
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create a request cache key for deduplication.
 * 
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 * @returns {string} Cache key
 */
function createRequestKey(url, options) {
  const method = options.method || 'GET'
  const body = options.body ? JSON.stringify(options.body) : ''
  return `${method}:${url}:${body}`
}

/**
 * Make an HTTP request with standardized error handling, retry logic, and timeout.
 * 
 * @param {string} url - Full URL to request
 * @param {Object} options - Fetch options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.headers] - Additional headers (merged with defaults)
 * @param {Object|string} [options.body] - Request body (auto-stringified if object)
 * @param {AbortSignal} [options.signal] - AbortController signal for cancellation
 * @param {number} [options.timeout=HTTP_TIMEOUT] - Request timeout in ms
 * @param {number} [options.retries=MAX_RETRIES] - Maximum retry attempts
 * @param {boolean} [options.deduplicate=true] - Enable request deduplication for GET requests
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {HttpError} If response is not ok after all retries
 * @throws {Error} For network errors after all retries
 * 
 * @example
 * const data = await httpClient('https://api.example.com/data', {
 *   method: 'POST',
 *   body: { key: 'value' },
 *   timeout: 10000,
 *   retries: 2
 * })
 */
export async function httpClient(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    signal: externalSignal,
    timeout = HTTP_TIMEOUT,
    retries = MAX_RETRIES,
    deduplicate = true,
    ...restOptions
  } = options

  // Request deduplication for GET requests
  if (method === 'GET' && deduplicate) {
    const requestKey = createRequestKey(url, { method, body })
    const pendingRequest = pendingRequests.get(requestKey)
    
    if (pendingRequest) {
      logger.debug('Returning cached pending request', { url, method })
      return pendingRequest
    }
  }

  const mergedHeaders = {
    ...DEFAULT_HEADERS,
    ...headers
  }

  // Execute request with retry logic
  const executeRequest = async () => {
    let lastError
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      // Create timeout controller for this attempt
      const timeoutController = new AbortController()
      const timeoutId = setTimeout(() => timeoutController.abort(), timeout)
      
      // Combine external signal with timeout signal
      const combinedSignal = externalSignal 
        ? createCombinedSignal([externalSignal, timeoutController.signal])
        : timeoutController.signal

      const requestOptions = {
        method,
        headers: mergedHeaders,
        signal: combinedSignal,
        ...restOptions
      }

      if (body) {
        requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
      }

      try {
        const response = await fetch(url, requestOptions)
        clearTimeout(timeoutId)

        if (!response.ok) {
          const error = await handleErrorResponse(response)
          
          // Retry on retryable status codes
          if (attempt < retries && isRetryable(error, response.status)) {
            const delay = calculateBackoffDelay(attempt)
            logger.warn(`Request failed, retrying in ${delay}ms`, { 
              url, 
              status: response.status, 
              attempt: attempt + 1, 
              maxRetries: retries 
            })
            await sleep(delay)
            continue
          }
          
          throw error
        }

        return await response.json()
      } catch (error) {
        clearTimeout(timeoutId)
        
        // Don't retry on AbortError (user cancellation or timeout from external signal)
        if (error.name === 'AbortError') {
          if (timeoutController.signal.aborted && !externalSignal?.aborted) {
            throw new Error(`Request timeout after ${timeout}ms`)
          }
          throw error
        }

        // Handle HTTP errors
        if (error instanceof HttpError) {
          lastError = error
          
          // Retry on retryable errors
          if (attempt < retries && isRetryable(error, error.status)) {
            const delay = calculateBackoffDelay(attempt)
            logger.warn(`Request failed, retrying in ${delay}ms`, { 
              url, 
              status: error.status, 
              attempt: attempt + 1, 
              maxRetries: retries 
            })
            await sleep(delay)
            continue
          }
          
          throw error
        }

        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          lastError = new Error('We\'re having trouble connecting right now. Please check your internet connection and try again.')
          
          // Retry network errors
          if (attempt < retries) {
            const delay = calculateBackoffDelay(attempt)
            logger.warn(`Network error, retrying in ${delay}ms`, { 
              url, 
              attempt: attempt + 1, 
              maxRetries: retries 
            })
            await sleep(delay)
            continue
          }
          
          throw lastError
        }

        // Re-throw other errors
        throw error
      }
    }
    
    // If we've exhausted all retries, throw the last error
    throw lastError || new Error('Request failed after all retry attempts')
  }

  // For GET requests with deduplication, cache the promise
  if (method === 'GET' && deduplicate) {
    const requestKey = createRequestKey(url, { method, body })
    const requestPromise = executeRequest().finally(() => {
      // Remove from cache after completion (success or failure)
      pendingRequests.delete(requestKey)
    })
    
    pendingRequests.set(requestKey, requestPromise)
    return requestPromise
  }

  return executeRequest()
}

/**
 * Create a combined AbortSignal from multiple signals.
 * 
 * @param {AbortSignal[]} signals - Array of abort signals
 * @returns {AbortSignal} Combined signal
 */
function createCombinedSignal(signals) {
  const controller = new AbortController()
  
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort()
      break
    }
    
    signal.addEventListener('abort', () => controller.abort(), { once: true })
  }
  
  return controller.signal
}

/**
 * Handle error responses with appropriate error messages.
 * 
 * @param {Response} response - Fetch response object
 * @returns {HttpError} Error object with status and message
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
  
  return new HttpError(errorMessage, status, errorData)
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

