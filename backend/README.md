# Luqma Backend

Spring Boot backend service for Luqma - a recipe search application with nutritional information.

See the [main README](../README.md) for tech stack, prerequisites, and project overview.

## Quick Start

```bash
cd backend

# Copy .env.example and configure
cp .env.example .env
# Edit .env and add your SPOONACULAR_API_KEY

# Run the application
./gradlew bootRun
```

The application will be available at http://localhost:8080 (default port)

## Development Commands

```bash
# Build
./gradlew build
./gradlew clean build

# Test
./gradlew test
./gradlew test jacocoTestReport    # With coverage report

# Security
./gradlew dependencyCheckAnalyze   # Check vulnerabilities
```

**Test Coverage Requirements:**
- Services: 80%+ (enforced)
- Controllers: 70%+ (recommended)
- Reports: `build/reports/jacoco/test/html/index.html`

For comprehensive testing documentation, see [Testing Guide](../docs/testing/README.md).


## API Endpoints

The backend exposes RESTful APIs for recipe search, details, and ingredient exclusion. For comprehensive API documentation including request/response schemas and examples, see [API Documentation](../docs/api/README.md).

**Interactive API documentation:** http://localhost:8080/swagger-ui.html (when running)

**Domain Models:** For detailed information about backend domain models (RecipeDetail, ExtendedIngredient, NutritionInfo, etc.), see [Domain Models Documentation](docs/domain-models.md).

## Configuration

The backend requires a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
# Edit .env and add your SPOONACULAR_API_KEY
```

### Required Configuration

Set these variables in `backend/.env`:

- **`SPOONACULAR_API_KEY`**: Your Spoonacular API key (required) - Get from [Spoonacular Console](https://spoonacular.com/food-api/console#Dashboard)
- **`SPRING_PROFILES_ACTIVE`**: Spring profile (optional, defaults to `dev`)

### Additional Configuration

Application-specific settings are in `backend/src/main/resources/application*.yaml`:
- `application.yaml` - Base configuration shared across all profiles
- `application-dev.yaml` - Development profile (verbose logging, detailed errors)
- `application-prod.yaml` - Production profile (optimized for performance)

To change the port, edit `server.port` in the appropriate YAML file.

## Spoonacular API Integration

The backend integrates with the Spoonacular API for all recipe data:

### Features
- **Recipe Search** - Uses Spoonacular's `complexSearch` endpoint with `titleMatch` parameter
- **Recipe Details** - Fetches complete recipe information with nutrition data
- **Caching** - Spring Cache (Caffeine) caches recipe details for 1 hour
- **Error Handling** - Comprehensive handling of rate limits (429), network errors, and API failures
- **Security** - API key sent via `x-api-key` header, never exposed to frontend

### Configuration
All Spoonacular API settings are in `application.yaml`:
```yaml
spoonacular:
  api-url: https://api.spoonacular.com
  api-key: ${SPOONACULAR_API_KEY}
  connection-timeout: 10000  # 10 seconds
  read-timeout: 30000        # 30 seconds
```

### Caching Strategy
Recipe details are cached using Spring Cache with Caffeine:
- **Cache Name:** `recipes`
- **Max Size:** 500 recipes
- **TTL:** 1 hour (3600 seconds)
- **Eviction:** LRU (Least Recently Used)

**Cache Configuration:**
- Configured in `backend/src/main/resources/application.yaml` (lines 13-17)
- Enabled via `@EnableCaching` annotation in `SpoonacularConfig.java`
- Caffeine spec: `maximumSize=500,expireAfterWrite=3600s`
- Applied to `RecipeRepository.findById()` method using `@Cacheable("recipes")`
- No separate `CacheConfig` class - caching is integrated into `SpoonacularConfig`

### Rate Limiting
The application includes built-in rate limiting to avoid exceeding Spoonacular API quotas:
- **Max Requests:** 100 per minute (configurable)
- **Scope:** Per IP address
- **Response:** HTTP 429 when limit exceeded

## Documentation

- [Documentation Index](../docs/README.md) - All project documentation
- [Domain Models](docs/domain-models.md) - Backend domain model reference
- [Architecture Overview](../docs/architecture/README.md) - System architecture and diagrams
- [Testing Guide](../docs/testing/README.md) - Testing strategies and coverage requirements
