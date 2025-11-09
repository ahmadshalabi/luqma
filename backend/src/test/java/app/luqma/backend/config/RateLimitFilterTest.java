package app.luqma.backend.config;

import app.luqma.backend.filter.RateLimitFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for RateLimitFilter.
 */
@ExtendWith(MockitoExtension.class)
class RateLimitFilterTest {
    
    @Mock
    private HttpServletRequest request;
    
    @Mock
    private HttpServletResponse response;
    
    @Mock
    private FilterChain filterChain;
    
    private RateLimitProperties properties;
    private RateLimitFilter filter;
    
    @BeforeEach
    void setUp() {
        properties = new RateLimitProperties();
        properties.setMaxRequestsPerMinute(5);
        properties.setWindowSizeMillis(60000);
        properties.setMaxEntries(100);
        properties.setCleanupIntervalMillis(300000);
        
        filter = new RateLimitFilter(properties);
        
        lenient().when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        lenient().when(request.getRequestURI()).thenReturn("/api/v1/recipes/search");
        lenient().when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        lenient().when(request.getHeader("X-Real-IP")).thenReturn(null);
    }
    
    @Test
    void doFilter_withValidRequest_allowsRequest() throws ServletException, IOException {
        // When
        filter.doFilter(request, response, filterChain);
        
        // Then
        verify(filterChain).doFilter(request, response);
        verify(response, never()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }
    
    @Test
    void doFilter_exceedingRateLimit_returnsT29() throws ServletException, IOException {
        // Given
        StringWriter writer = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(writer));
        
        // Make 5 requests (at the limit)
        for (int i = 0; i < 5; i++) {
            filter.doFilter(request, response, filterChain);
        }
        
        // When - 6th request should be rate limited
        filter.doFilter(request, response, filterChain);
        
        // Then
        verify(response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        verify(response).setContentType("application/json");
        assertThat(writer.toString()).contains("Too Many Requests");
        assertThat(writer.toString()).contains("Rate limit exceeded");
    }
    
    @Test
    void doFilter_withXForwardedForHeader_usesCorrectIp() throws ServletException, IOException {
        // Given
        when(request.getHeader("X-Forwarded-For")).thenReturn("10.0.0.1, 10.0.0.2");
        
        // When
        filter.doFilter(request, response, filterChain);
        
        // Then
        verify(filterChain).doFilter(request, response);
    }
    
    @Test
    void doFilter_withInvalidXForwardedFor_fallsBackToRemoteAddr() throws ServletException, IOException {
        // Given
        when(request.getHeader("X-Forwarded-For")).thenReturn("invalid-ip");
        
        // When
        filter.doFilter(request, response, filterChain);
        
        // Then
        verify(filterChain).doFilter(request, response);
    }
    
    @Test
    void doFilter_withXRealIPHeader_usesCorrectIp() throws ServletException, IOException {
        // Given
        when(request.getHeader("X-Real-IP")).thenReturn("172.16.0.1");
        
        // When
        filter.doFilter(request, response, filterChain);
        
        // Then
        verify(filterChain).doFilter(request, response);
    }
    
    @Test
    void doFilter_afterWindowExpires_resetsCounter() throws ServletException, IOException {
        // Given
        RateLimitProperties shortWindowProperties = new RateLimitProperties();
        shortWindowProperties.setMaxRequestsPerMinute(2);
        shortWindowProperties.setWindowSizeMillis(100); // 100ms window
        shortWindowProperties.setMaxEntries(100);
        shortWindowProperties.setCleanupIntervalMillis(300000);
        
        RateLimitFilter shortFilter = new RateLimitFilter(shortWindowProperties);
        
        // Make 2 requests (at the limit)
        shortFilter.doFilter(request, response, filterChain);
        shortFilter.doFilter(request, response, filterChain);
        
        // Wait for window to expire
        try {
            Thread.sleep(150);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // When - Should allow new request after window reset
        shortFilter.doFilter(request, response, filterChain);
        
        // Then
        verify(filterChain, times(3)).doFilter(request, response);
        verify(response, never()).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    }
}

