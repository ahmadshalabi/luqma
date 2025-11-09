package app.luqma.backend.util;

/**
 * Utility class for sanitizing strings to prevent security vulnerabilities.
 * Provides methods for safe logging and query handling.
 */
public final class StringSanitizer {
  
  private StringSanitizer() {
    throw new UnsupportedOperationException("Utility class - do not instantiate");
  }
  
  /**
   * Sanitizes input for safe logging.
   * Removes control characters and limits length to prevent log injection attacks.
   *
   * @param input the input string to sanitize
   * @param maxLength maximum length for the sanitized string
   * @return sanitized string safe for logging, empty string if input is null
   */
  public static String sanitizeForLogging(String input, int maxLength) {
    if (input == null) {
      return "";
    }
    
    String sanitized = input.replaceAll("[\\p{Cntrl}]", "");
    
    if (sanitized.length() > maxLength) {
      sanitized = sanitized.substring(0, maxLength) + "...";
    }
    
    return sanitized;
  }
  
  /**
   * Sanitizes query parameters for safe processing.
   * Removes control characters and trims whitespace.
   * Note: JSON serialization (Jackson) handles output encoding automatically,
   * so HTML escaping is not needed and could cause double-encoding issues.
   *
   * @param input the query string to sanitize
   * @return sanitized query string, empty string if input is null
   */
  public static String sanitizeForQuery(String input) {
    if (input == null) {
      return "";
    }
    
    String sanitized = input.trim();
    sanitized = sanitized.replaceAll("[\\p{Cntrl}]", "");
    
    return sanitized;
  }
  
  /**
   * Sanitizes query strings for safe logging.
   * Removes newlines and carriage returns to prevent log injection.
   *
   * @param queryString the query string to sanitize
   * @return sanitized query string, empty string if input is null or blank
   */
  public static String sanitizeQueryString(String queryString) {
    if (queryString == null || queryString.isBlank()) {
      return "";
    }
    return queryString.replaceAll("[\\n\\r]", "");
  }
}

