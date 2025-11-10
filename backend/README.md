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
  - Currently using mock data

**Recipe Details:**
- `GET /api/v1/recipes/{id}` - Get complete recipe information
  - Path parameter: `id` (recipe ID, positive integer)
  - Returns: ingredients, nutrition, instructions
  - Currently using mock data

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

## Documentation

- [Main README](../README.md) - Project overview and setup
- [Frontend README](../frontend/README.md) - Frontend setup
- [Troubleshooting Guide](../docs/TROUBLESHOOTING.md) - Common issues
- [Architecture Decisions](../docs/decisions/) - ADRs
