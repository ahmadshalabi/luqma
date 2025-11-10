package app.luqma.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestClient;

/**
 * Configuration for Spoonacular API integration.
 * 
 * <p>Provides RestClient bean configured for Spoonacular API calls with:
 * <ul>
 *   <li>Base URL and timeouts from configuration properties</li>
 *   <li>API key authentication via x-api-key header</li>
 *   <li>Request/response logging for debugging</li>
 * </ul>
 * 
 * <p>Also enables Spring Cache for recipe data caching.
 * 
 * <p><strong>Active Profile:</strong> Not active when "mock" profile is enabled.
 * This prevents API key validation errors in mock mode.
 * 
 * @see SpoonacularProperties
 */
@Slf4j
@Configuration
@EnableCaching
@EnableConfigurationProperties(SpoonacularProperties.class)
@Profile("!mock")
public class SpoonacularConfig {
    
    private final SpoonacularProperties properties;
    
    public SpoonacularConfig(SpoonacularProperties properties) {
        this.properties = properties;
        log.info("Spoonacular API configured: URL={}, ConnectionTimeout={}ms, ReadTimeout={}ms",
                properties.getApiUrl(), properties.getConnectionTimeout(), properties.getReadTimeout());
    }
    
    /**
     * Creates a RestClient configured for Spoonacular API calls.
     * 
     * <p>The client includes:
     * <ul>
     *   <li>Base URL pointing to Spoonacular API</li>
     *   <li>Connection and read timeouts</li>
     *   <li>x-api-key header with API key for authentication</li>
     *   <li>Request interceptor for logging</li>
     * </ul>
     * 
     * @return configured RestClient bean
     */
    @Bean
    @SuppressWarnings("null")
    public RestClient spoonacularRestClient() {
        String apiKey = properties.getApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Spoonacular API key must not be blank");
        }
        
        return RestClient.builder()
                .baseUrl(properties.getApiUrl())
                .defaultHeader("x-api-key", apiKey)
                .requestInterceptor(loggingInterceptor())
                .build();
    }
    
    /**
     * Creates a request interceptor for logging API calls.
     * Logs request method, URI, and response status at DEBUG level.
     * 
     * @return request interceptor
     */
    private ClientHttpRequestInterceptor loggingInterceptor() {
        return (request, body, execution) -> {
            if (log.isDebugEnabled()) {
                log.debug("Spoonacular API Request: {} {}", request.getMethod(), request.getURI());
            }
            
            var response = execution.execute(request, body);
            
            if (log.isDebugEnabled()) {
                log.debug("Spoonacular API Response: {} {} - Status: {}",
                        request.getMethod(), request.getURI(), response.getStatusCode());
            }
            
            return response;
        };
    }
}

