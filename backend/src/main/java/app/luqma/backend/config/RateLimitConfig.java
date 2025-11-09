package app.luqma.backend.config;

import app.luqma.backend.filter.RateLimitFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * Configuration for rate limiting.
 * Registers the rate limit filter and schedules periodic cleanup.
 */
@Configuration
@EnableScheduling
public class RateLimitConfig {
    
    private final RateLimitProperties rateLimitProperties;
    private RateLimitFilter rateLimitFilter;
    
    public RateLimitConfig(RateLimitProperties rateLimitProperties) {
        this.rateLimitProperties = rateLimitProperties;
    }
    
    @Bean
    public FilterRegistrationBean<RateLimitFilter> rateLimitFilter() {
        this.rateLimitFilter = new RateLimitFilter(rateLimitProperties);
        FilterRegistrationBean<RateLimitFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(rateLimitFilter);
        registrationBean.addUrlPatterns("/api/v1/**");
        // Order 10 ensures this runs AFTER Spring Security's CORS filter (order ~0)
        registrationBean.setOrder(10);
        return registrationBean;
    }
    
    @Scheduled(fixedDelayString = "#{@rateLimitProperties.cleanupIntervalMillis}")
    public void scheduleRateLimitCleanup() {
        if (rateLimitFilter != null) {
            rateLimitFilter.cleanUpOldEntries();
        }
    }
}
