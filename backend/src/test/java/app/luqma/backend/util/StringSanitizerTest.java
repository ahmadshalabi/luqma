package app.luqma.backend.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests for StringSanitizer utility class.
 */
class StringSanitizerTest {
  
  @Test
  void sanitizeForLogging_withNullInput_returnsEmptyString() {
    // When
    String result = StringSanitizer.sanitizeForLogging(null, 100);
    
    // Then
    assertThat(result).isEmpty();
  }
  
  @Test
  void sanitizeForLogging_withControlCharacters_removesControlCharacters() {
    // Given
    String input = "test\nwith\rcontrol\tchars";
    
    // When
    String result = StringSanitizer.sanitizeForLogging(input, 100);
    
    // Then
    assertThat(result).isEqualTo("testwithcontrolchars");
    assertThat(result).doesNotContain("\n", "\r", "\t");
  }
  
  @Test
  void sanitizeForLogging_withLongInput_truncatesAndAddsEllipsis() {
    // Given
    String input = "a".repeat(150);
    
    // When
    String result = StringSanitizer.sanitizeForLogging(input, 100);
    
    // Then
    assertThat(result).hasSize(103); // 100 + "..."
    assertThat(result).endsWith("...");
  }
  
  @Test
  void sanitizeForLogging_withNormalInput_returnsUnchanged() {
    // Given
    String input = "normal text";
    
    // When
    String result = StringSanitizer.sanitizeForLogging(input, 100);
    
    // Then
    assertThat(result).isEqualTo(input);
  }
  
  @Test
  void sanitizeForQuery_withNullInput_returnsEmptyString() {
    // When
    String result = StringSanitizer.sanitizeForQuery(null);
    
    // Then
    assertThat(result).isEmpty();
  }
  
  @Test
  void sanitizeForQuery_withWhitespace_trimsWhitespace() {
    // Given
    String input = "  test query  ";
    
    // When
    String result = StringSanitizer.sanitizeForQuery(input);
    
    // Then
    assertThat(result).isEqualTo("test query");
  }
  
  @Test
  void sanitizeForQuery_withHtmlCharacters_removesControlCharactersOnly() {
    // Given
    String input = "<script>alert('xss')</script>";
    
    // When
    String result = StringSanitizer.sanitizeForQuery(input);
    
    // Then
    // Note: HTML escaping removed as Jackson handles output encoding
    assertThat(result).isEqualTo("<script>alert('xss')</script>");
    assertThat(result).doesNotContain("\n", "\r", "\t");
  }
  
  @Test
  void sanitizeForQuery_withControlCharacters_removesControlCharacters() {
    // Given
    String input = "test\nquery\r\nwith\tcontrols";
    
    // When
    String result = StringSanitizer.sanitizeForQuery(input);
    
    // Then
    assertThat(result).isEqualTo("testquerywithcontrols");
    assertThat(result).doesNotContain("\n", "\r", "\t");
  }
  
  @Test
  void sanitizeForQuery_withNormalInput_returnsUnchanged() {
    // Given
    String input = "pasta carbonara";
    
    // When
    String result = StringSanitizer.sanitizeForQuery(input);
    
    // Then
    assertThat(result).isEqualTo(input);
  }
  
  @Test
  void sanitizeQueryString_withNullInput_returnsEmptyString() {
    // When
    String result = StringSanitizer.sanitizeQueryString(null);
    
    // Then
    assertThat(result).isEmpty();
  }
  
  @Test
  void sanitizeQueryString_withBlankInput_returnsEmptyString() {
    // When
    String result = StringSanitizer.sanitizeQueryString("   ");
    
    // Then
    assertThat(result).isEmpty();
  }
  
  @Test
  void sanitizeQueryString_withNewlines_removesNewlines() {
    // Given
    String input = "query=test\ninjection=attempt\r\n";
    
    // When
    String result = StringSanitizer.sanitizeQueryString(input);
    
    // Then
    assertThat(result).isEqualTo("query=testinjection=attempt");
    assertThat(result).doesNotContain("\n", "\r");
  }
  
  @Test
  void sanitizeQueryString_withNormalInput_returnsUnchanged() {
    // Given
    String input = "query=pasta&page=1&pageSize=9";
    
    // When
    String result = StringSanitizer.sanitizeQueryString(input);
    
    // Then
    assertThat(result).isEqualTo(input);
  }
}

