package app.luqma.backend.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for StringSanitizer utility class.
 */
class StringSanitizerTest {
  
  @Test
  void sanitizeForLogging_withNullInput_returnsEmptyString() {
    String result = StringSanitizer.sanitizeForLogging(null, 100);
    
    assertThat(result).isEmpty();
  }
  
  @Test
  void sanitizeForLogging_withControlCharacters_removesControlCharacters() {
    String input = "test\nwith\rcontrol\tchars";
    
    String result = StringSanitizer.sanitizeForLogging(input, 100);
    
    assertThat(result).isEqualTo("testwithcontrolchars");
    assertThat(result).doesNotContain("\n", "\r", "\t");
  }
  
  @Test
  void sanitizeForLogging_withLongInput_truncatesAndAddsEllipsis() {
    String input = "a".repeat(150);
    
    String result = StringSanitizer.sanitizeForLogging(input, 100);
    
    assertThat(result).hasSize(103); // 100 + "..."
    assertThat(result).endsWith("...");
  }
  
  @Test
  void sanitizeForLogging_withNormalInput_returnsUnchanged() {
    String input = "normal text";
    
    String result = StringSanitizer.sanitizeForLogging(input, 100);
    
    assertThat(result).isEqualTo(input);
  }
  
  @Test
  void sanitizeForQuery_withNullInput_returnsEmptyString() {
    String result = StringSanitizer.sanitizeForQuery(null);
    
    assertThat(result).isEmpty();
  }
  
  @Test
  void sanitizeForQuery_withWhitespace_trimsWhitespace() {
    String input = "  test query  ";
    
    String result = StringSanitizer.sanitizeForQuery(input);
    
    assertThat(result).isEqualTo("test query");
  }
  
  @Test
  void sanitizeForQuery_withHtmlCharacters_removesControlCharactersOnly() {
    String input = "<script>alert('xss')</script>";
    
    String result = StringSanitizer.sanitizeForQuery(input);
    
    // Note: HTML escaping removed as Jackson handles output encoding
    assertThat(result).isEqualTo("<script>alert('xss')</script>");
    assertThat(result).doesNotContain("\n", "\r", "\t");
  }
  
  @Test
  void sanitizeForQuery_withControlCharacters_removesControlCharacters() {
    String input = "test\nquery\r\nwith\tcontrols";
    
    String result = StringSanitizer.sanitizeForQuery(input);
    
    assertThat(result).isEqualTo("testquerywithcontrols");
    assertThat(result).doesNotContain("\n", "\r", "\t");
  }
  
  @Test
  void sanitizeForQuery_withNormalInput_returnsUnchanged() {
    String input = "pasta carbonara";
    
    String result = StringSanitizer.sanitizeForQuery(input);
    
    assertThat(result).isEqualTo(input);
  }
  
  @Test
  void sanitizeQueryString_withNullInput_returnsEmptyString() {
    String result = StringSanitizer.sanitizeQueryString(null);
    
    assertThat(result).isEmpty();
  }
  
  @Test
  void sanitizeQueryString_withBlankInput_returnsEmptyString() {
    String result = StringSanitizer.sanitizeQueryString("   ");
    
    assertThat(result).isEmpty();
  }
  
  @Test
  void sanitizeQueryString_withNewlines_removesNewlines() {
    String input = "query=test\ninjection=attempt\r\n";
    
    String result = StringSanitizer.sanitizeQueryString(input);
    
    assertThat(result).isEqualTo("query=testinjection=attempt");
    assertThat(result).doesNotContain("\n", "\r");
  }
  
  @Test
  void sanitizeQueryString_withNormalInput_returnsUnchanged() {
    String input = "query=pasta&page=1&pageSize=9";
    
    String result = StringSanitizer.sanitizeQueryString(input);
    
    assertThat(result).isEqualTo(input);
  }
}

