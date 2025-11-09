# Luqma API Documentation

## Interactive Documentation

When the backend is running, you can access interactive API documentation at:

**Swagger UI:** http://localhost:8080/swagger-ui.html (default URL)

The Swagger UI provides:
- Interactive API exploration
- Request/response examples
- Schema definitions
- Try-it-out functionality

## API Overview

### Recipe Search API

**Endpoint:** `GET /api/v1/recipes/search`

Search for recipes with pagination support. See [Backend README](../../backend/README.md) for detailed parameters and examples.

**Quick Example:**
```bash
curl "http://localhost:8080/api/v1/recipes/search?query=pasta&page=1&pageSize=9"
```

**Implementation Notes:**
- Query parameter is required (1-200 characters)
- Case-insensitive substring match on recipe titles
- Currently using mock data (Spoonacular integration pending)
- Rate limiting applied

### Planned Endpoints (Coming Soon)

- **GET /api/v1/recipes/{id}** - Get detailed recipe information
- **POST /api/v1/recipes/{id}/exclude-ingredients** - Exclude ingredients and recalculate nutrition

## Security

- **CORS:** Configured in `backend/src/main/resources/application.yaml`
- **Rate Limiting:** Applied per environment configuration
- **Input Validation:** All inputs sanitized and validated

## Related Documentation

- [Backend README](../../backend/README.md) - Complete API documentation and setup guide
- [Troubleshooting Guide](../TROUBLESHOOTING.md) - Common issues and solutions
- [Architecture Decisions](../decisions/) - ADRs documenting technical decisions
- [Main README](../../README.md) - Project overview and setup
