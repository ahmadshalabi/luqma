# Luqma Backend

Spring Boot backend service for Luqma - a recipe search application with nutritional information.

## Prerequisites

- **Java 25**
- **[Spoonacular API Key](https://spoonacular.com/food-api)** (required)
- **Docker & Docker Compose** (optional)

## Quick Start

```bash
cd backend

# Setup and run
./scripts/setup-local.sh
./scripts/run-local.sh

# Or run with Docker
docker compose up
```

The application will be available at: **http://localhost:8080**

## Verify Installation

```bash
./scripts/verify-setup.sh
```

## Configuration

Configure via `.env` file (see `.env.example` for template). Required:

- `SPOONACULAR_API_KEY` - Your Spoonacular API key

## Development

```bash
# Build
./gradlew build

# Run tests
./gradlew test

# Generate test coverage report
./gradlew test jacocoTestReport

# View coverage report (opens in browser)
# Location: backend/build/reports/jacoco/test/html/index.html

# Clean build
./gradlew clean build
```

## Test Coverage

The project uses JaCoCo for code coverage with the following requirements:

- **Services**: 80%+ line coverage (enforced)
- **Controllers**: 70%+ line coverage (recommended)

Coverage reports include:
- HTML report: `build/reports/jacoco/test/html/index.html`
- XML report: `build/reports/jacoco/test/jacocoTestReport.xml`

## Docker

```bash
docker compose up              # Start
docker compose logs -f         # View logs
docker compose down            # Stop
./scripts/docker-rebuild.sh    # Clean rebuild
```

## Related Documentation

- [Project Documentation](../docs/README.md)
- [Architecture Decisions](../docs/decisions/)
- [Frontend README](../frontend/README.md)
