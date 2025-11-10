# Luqma Backend

Spring Boot backend service for Luqma - a recipe search application with nutritional information.

## Tech Stack

Spring Boot 3.5.7 • Java 25 • Gradle • JaCoCo • Swagger/OpenAPI • Spoonacular API

## Prerequisites

- **Java 25+** - [Download](https://adoptium.net/)
- **[Spoonacular API Key](https://spoonacular.com/food-api)** - [Get free key](https://spoonacular.com/food-api/console#Dashboard)

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


## API Endpoints

**Recipe Search:**
- `GET /api/v1/recipes/search` - Search recipes with pagination
  - Parameters: `query` (required), `page`, `pageSize`
  - Powered by Spoonacular API

**Recipe Details:**
- `GET /api/v1/recipes/{id}` - Get complete recipe information
  - Path parameter: `id` (recipe ID, positive integer)
  - Returns: ingredients, nutrition, instructions
  - Powered by Spoonacular API with caching

**Ingredient Exclusion:**
- `POST /api/v1/recipes/{id}/exclude-ingredients` - Exclude ingredients and recalculate nutrition
  - Path parameter: `id` (recipe ID, positive integer)
  - Request body: `{ "ingredientIds": [20409, 5006] }` (array of ingredient IDs to exclude)
  - Returns: Updated recipe with recalculated nutrition based on remaining ingredients
  - Validates all ingredient IDs exist in the recipe

**Health & Monitoring:**
- `GET /actuator/health` - Health check
- `GET /actuator/health/liveness` - Liveness probe
- `GET /actuator/health/readiness` - Readiness probe
- `GET /actuator/info` - Application info

**Full API documentation:** http://localhost:8080/swagger-ui.html  
*(Only exposes public REST API models - internal domain models are hidden)*

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

### Rate Limiting
The application includes built-in rate limiting to avoid exceeding Spoonacular API quotas:
- **Max Requests:** 100 per minute (configurable)
- **Scope:** Per IP address
- **Response:** HTTP 429 when limit exceeded

## Documentation

- [Main README](../README.md) - Project overview and setup
- [Frontend README](../frontend/README.md) - Frontend setup
- [Troubleshooting Guide](../docs/TROUBLESHOOTING.md) - Common issues
- [Architecture Decisions](../docs/decisions/) - ADRs
