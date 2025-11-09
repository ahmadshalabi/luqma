package app.luqma.backend.filter;

import app.luqma.backend.config.RateLimitProperties;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/**
 * Rate limiting filter using sliding window algorithm.
 * Limits requests per IP address to prevent abuse.
 * Uses configurable properties and scheduled cleanup to prevent memory leaks.
 */
@Slf4j
public class RateLimitFilter implements Filter {
    
    private static final Pattern IP_PATTERN = Pattern.compile(
        "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}" +
        "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    );
    
    private final RateLimitProperties properties;
    private final Map<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();
    
    public RateLimitFilter(RateLimitProperties properties) {
        this.properties = properties;
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            chain.doFilter(request, response);
            return;
        }
        
        String clientIp = getClientIp(httpRequest);
        
        if (!isValidIp(clientIp)) {
            log.warn("Invalid or missing client IP address, using default");
            clientIp = "unknown";
        }
        
        if (rateLimitMap.size() > properties.getMaxEntries()) {
            cleanUpOldEntries();
        }
        
        RateLimitInfo rateLimitInfo = rateLimitMap.computeIfAbsent(
            clientIp, 
            _ -> new RateLimitInfo(properties.getMaxRequestsPerMinute(), properties.getWindowSizeMillis())
        );
        
        if (rateLimitInfo.allowRequest()) {
            chain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for IP: {}", clientIp);
            httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write(
                String.format("{\"timestamp\":\"%s\",\"status\":429,\"error\":\"Too Many Requests\"," +
                             "\"message\":\"Rate limit exceeded. Maximum %d requests per minute allowed.\"," +
                             "\"path\":\"%s\"}",
                             Instant.now().toString(),
                             properties.getMaxRequestsPerMinute(),
                             httpRequest.getRequestURI())
            );
        }
    }
    
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            String firstIp = xForwardedFor.split(",")[0].trim();
            if (isValidIp(firstIp)) {
                return firstIp;
            }
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && isValidIp(xRealIp.trim())) {
            return xRealIp.trim();
        }
        
        return request.getRemoteAddr();
    }
    
    /**
     * Validates if a string is a valid IPv4 address.
     * 
     * @param ip the IP address to validate
     * @return true if valid IPv4, false otherwise
     */
    private boolean isValidIp(String ip) {
        if (ip == null || ip.isEmpty()) {
            return false;
        }
        return IP_PATTERN.matcher(ip).matches();
    }
    
    /**
     * Cleans up old rate limit entries that have expired.
     * Public to allow scheduled cleanup from RateLimitConfig.
     */
    public void cleanUpOldEntries() {
        long now = System.currentTimeMillis();
        int sizeBefore = rateLimitMap.size();
        rateLimitMap.entrySet().removeIf(entry -> 
            now - entry.getValue().getWindowStart() > properties.getWindowSizeMillis()
        );
        int sizeAfter = rateLimitMap.size();
        log.debug("Cleaned up {} old rate limit entries. Current size: {}", sizeBefore - sizeAfter, sizeAfter);
    }
    
    /**
     * Stores rate limiting information for a single IP address.
     */
    static class RateLimitInfo {
        private final int maxRequests;
        private final long windowSize;
        private volatile long windowStart;
        private volatile int requestCount;
        
        RateLimitInfo(int maxRequests, long windowSize) {
            this.maxRequests = maxRequests;
            this.windowSize = windowSize;
            this.windowStart = System.currentTimeMillis();
            this.requestCount = 0;
        }
        
        synchronized boolean allowRequest() {
            long now = System.currentTimeMillis();
            
            if (now - windowStart > windowSize) {
                windowStart = now;
                requestCount = 0;
            }
            
            requestCount++;
            return requestCount <= maxRequests;
        }
        
        long getWindowStart() {
            return windowStart;
        }
    }
}

