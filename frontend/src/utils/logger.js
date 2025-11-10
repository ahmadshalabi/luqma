/**
 * Logger Utility
 * 
 * Provides structured logging with environment-aware behavior.
 * In production, errors are logged to an error tracking service (placeholder for future implementation).
 * In development, logs are output to console with appropriate formatting.
 * 
 * @module logger
 */

const isDevelopment = import.meta.env.MODE === 'development'

/**
 * Log levels
 */
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
}

/**
 * Log an error message.
 * In production, this would send to an error tracking service (e.g., Sentry).
 * In development, logs to console.
 * 
 * @param {string} message - Error message
 * @param {Error|Object} [error] - Error object or additional context
 * @param {Object} [context] - Additional context data
 * 
 * @example
 * logger.error('Failed to fetch data', err, { userId: 123 })
 */
export function error(message, error = null, context = {}) {
  if (isDevelopment) {
    console.error(`[ERROR] ${message}`, error, context)  
  } else {
    // In production, send to error tracking service
    // TODO: Integrate with Sentry, LogRocket, or similar service
    const logData = {
      level: LOG_LEVELS.ERROR,
      message,
      timestamp: new Date().toISOString(),
      ...context
    }

    if (error) {
      logData.error = {
        message: error.message,
        stack: error.stack,
        ...(error.status && { status: error.status })
      }
    }
    
    // sendToErrorTracking(logData)
  }
}

/**
 * Log a warning message.
 * 
 * @param {string} message - Warning message
 * @param {Object} [context] - Additional context data
 * 
 * @example
 * logger.warn('Missing required prop', { component: 'Button', prop: 'onClick' })
 */
export function warn(message, context = {}) {
  if (isDevelopment) {
    console.warn(`[WARN] ${message}`, context)  
  }
  // In production, optionally send to error tracking
  // TODO: Integrate with error tracking service
  // const logData = { level: LOG_LEVELS.WARN, message, timestamp: new Date().toISOString(), ...context }
  // sendToErrorTracking(logData)
}

/**
 * Log an informational message (development only).
 * 
 * @param {string} message - Info message
 * @param {Object} [context] - Additional context data
 * 
 * @example
 * logger.info('User logged in', { userId: 123 })
 */
export function info(message, context = {}) {
  if (isDevelopment) {
    console.info(`[INFO] ${message}`, context)  
  }
}

/**
 * Log a debug message (development only).
 * 
 * @param {string} message - Debug message
 * @param {Object} [context] - Additional context data
 * 
 * @example
 * logger.debug('API response received', { endpoint: '/api/recipes', data })
 */
export function debug(message, context = {}) {
  if (isDevelopment) {
    console.debug(`[DEBUG] ${message}`, context)  
  }
}

/**
 * Logger object with all logging methods.
 */
export const logger = {
  error,
  warn,
  info,
  debug
}

