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
- Searches recipes via Spoonacular API using `complexSearch` endpoint with `titleMatch` parameter
- Results are cached using Spring Cache (Caffeine) for improved performance
- Rate limiting applied to protect API quotas

### Recipe Details API

**Endpoint:** `GET /api/v1/recipes/{id}`

Get complete recipe information including ingredients, nutrition, and cooking instructions.

**Quick Example:**
```bash
curl "http://localhost:8080/api/v1/recipes/715497"
```

**Implementation Notes:**
- Returns 404 if recipe not found
- Recipe ID must be a positive integer
- Fetches data from Spoonacular API and caches for 1 hour (max 500 recipes, LRU eviction)
- Includes comprehensive nutrition information with caloric breakdown
- Provides step-by-step cooking instructions

**Response Structure:**
- Basic info: title, image, servings, ready time
- Ingredients list with measurements (simplified: id, name, amount, unit)
- Nutrition data with macronutrients and percentages
- Step-by-step cooking instructions

**OpenAPI Schema Names:**
- Internal DTOs use clean names in API docs: `Ingredient`, `Nutrition` (not `IngredientDTO`, `NutritionDTO`)
- Domain models are excluded from API documentation (internal implementation only)

### Ingredient Exclusion API

**Endpoint:** `POST /api/v1/recipes/{id}/exclude-ingredients`

Exclude specific ingredients from a recipe and recalculate nutrition information based on remaining ingredients.

**Quick Example:**
```bash
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [20409, 5006]}'
```

**Request Body:**
```json
{
  "ingredientIds": [20409, 5006]
}
```

**Implementation Notes:**
- Validates all ingredient IDs exist in the recipe
- Returns 404 if recipe not found
- Returns 400 if any ingredient ID is invalid or doesn't exist in the recipe
- Recalculates nutrition proportionally based on excluded ingredients using ADR-0010 approach
- Uses cached recipe data from Spoonacular API

**Response Structure:**
- Same as Recipe Details API, but with:
  - Excluded ingredients removed from ingredients list
  - Nutrition values recalculated based on remaining ingredients
  - All macronutrient percentages updated accordingly

**Validation:**
- Recipe ID must be a positive integer
- At least one ingredient ID must be provided
- All ingredient IDs must exist in the recipe
- Ingredient IDs must be positive integers

## Security

- **CORS:** Configured in `backend/src/main/resources/application.yaml`
- **Rate Limiting:** Applied per environment configuration
- **Input Validation:** All inputs sanitized and validated

## Related Documentation

- [Backend README](../../backend/README.md) - Complete API documentation and setup guide
- [Troubleshooting Guide](../TROUBLESHOOTING.md) - Common issues and solutions
- [Architecture Decisions](../decisions/) - ADRs documenting technical decisions
- [Main README](../../README.md) - Project overview and setup
