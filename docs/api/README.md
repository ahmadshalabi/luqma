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

Search for recipes with pagination support.

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | - | Search term (1-200 characters) |
| `page` | integer | No | 1 | Page number (min: 1) |
| `pageSize` | integer | No | 9 | Results per page (1-100) |

**Quick Example:**
```bash
curl "http://localhost:8080/api/v1/recipes/search?query=pasta&page=1&pageSize=9"
```

**Success Response (200 OK):**
```json
{
  "recipes": [
    {
      "id": 654959,
      "title": "Pasta Carbonara",
      "image": "https://spoonacular.com/recipeImages/654959-312x231.jpg",
      "summary": "Classic Italian pasta dish..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 9,
    "totalResults": 127
  }
}
```

**Error Responses:**

| Status Code | Description | Example |
|-------------|-------------|---------|
| 400 Bad Request | Invalid query parameter | `{"error": "Query must be between 1 and 200 characters"}` |
| 429 Too Many Requests | Rate limit exceeded | `{"error": "Too many requests. Please try again later."}` |
| 500 Internal Server Error | Server or external API error | `{"error": "An unexpected error occurred"}` |

**Implementation Notes:**
- Query parameter is required (1-200 characters)
- Powered by Spoonacular API (see [Backend README](../../backend/README.md#spoonacular-api-integration) for integration details)
- Results are not cached (fresh results each time)
- Rate limiting: 100 requests/minute per IP address
- External API rate limit: 150 requests/day (free tier)

### Recipe Details API

**Endpoint:** `GET /api/v1/recipes/{id}`

Get complete recipe information including ingredients, nutrition, and cooking instructions.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | ✅ Yes | Recipe ID (positive integer) |

**Quick Example:**
```bash
curl "http://localhost:8080/api/v1/recipes/715497"
```

**Success Response (200 OK):**
```json
{
  "id": 715497,
  "title": "Berry Banana Breakfast Smoothie",
  "image": "https://spoonacular.com/recipeImages/715497-556x370.jpg",
  "servings": 1,
  "readyInMinutes": 5,
  "ingredients": [
    {
      "id": 9040,
      "name": "banana",
      "amount": 0.5,
      "unit": ""
    },
    {
      "id": 1116,
      "name": "yogurt",
      "amount": 0.25,
      "unit": "cup"
    }
  ],
  "nutrition": {
    "calories": 314.43,
    "protein": "12.46g",
    "fat": "8.88g",
    "carbs": "50.74g",
    "nutrients": [
      {
        "name": "Calories",
        "amount": 314.43,
        "unit": "kcal",
        "percentOfDailyNeeds": 15.72
      }
    ]
  },
  "instructions": [
    {
      "name": "",
      "steps": [
        {
          "number": 1,
          "step": "Add all ingredients to a blender and blend until smooth."
        }
      ]
    }
  ]
}
```

**Error Responses:**

| Status Code | Description | Example |
|-------------|-------------|---------|
| 400 Bad Request | Invalid recipe ID | `{"error": "Recipe ID must be a positive integer"}` |
| 404 Not Found | Recipe not found | `{"error": "Recipe not found with ID: 999999"}` |
| 429 Too Many Requests | Rate limit exceeded | `{"error": "Too many requests. Please try again later."}` |
| 500 Internal Server Error | Server or external API error | `{"error": "An unexpected error occurred"}` |

**Implementation Notes:**
- Recipe ID must be a positive integer
- Powered by Spoonacular API with caching (see [Backend README](../../backend/README.md#spoonacular-api-integration) for details)
- Results cached for 1 hour (3600 seconds)
- Cache size: 500 most popular recipes (LRU eviction)
- Includes comprehensive nutrition information with caloric breakdown
- Provides step-by-step cooking instructions

**Response Structure:**
- Basic info: title, image, servings, ready time
- Ingredients list with measurements (id, name, amount, unit)
- Nutrition data with macronutrients and percentages
- Step-by-step cooking instructions

**OpenAPI Schema Names:**
- Internal DTOs use clean names in API docs: `Ingredient`, `Nutrition` (not `IngredientDTO`, `NutritionDTO`)
- Domain models are excluded from API documentation (internal implementation only)

### Ingredient Exclusion API

**Endpoint:** `POST /api/v1/recipes/{id}/exclude-ingredients`

Exclude specific ingredients from a recipe and recalculate nutrition information based on remaining ingredients.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | ✅ Yes | Recipe ID (positive integer) |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ingredientIds` | integer[] | ✅ Yes | Array of ingredient IDs to exclude (min: 1 item) |

**Quick Example:**
```bash
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [9040, 1116]}'
```

**Request Body Example:**
```json
{
  "ingredientIds": [9040, 1116]
}
```

**Success Response (200 OK):**

Same structure as Recipe Details API, but with:
- Excluded ingredients removed from `ingredients` array
- Nutrition values recalculated proportionally
- Updated macronutrient percentages

```json
{
  "id": 715497,
  "title": "Berry Banana Breakfast Smoothie",
  "ingredients": [
    {
      "id": 9050,
      "name": "strawberries",
      "amount": 0.25,
      "unit": "cup"
    }
  ],
  "nutrition": {
    "calories": 157.85,
    "protein": "1.64g",
    "fat": "0.48g",
    "carbs": "39.01g",
    "nutrients": [...]
  },
  "instructions": [...]
}
```

**Error Responses:**

| Status Code | Description | Example |
|-------------|-------------|---------|
| 400 Bad Request | Invalid request body or ingredient IDs | `{"error": "Ingredient ID 999 does not exist in this recipe"}` |
| 400 Bad Request | Empty ingredient IDs array | `{"error": "At least one ingredient ID must be provided"}` |
| 400 Bad Request | Invalid ingredient ID format | `{"error": "Ingredient IDs must be positive integers"}` |
| 404 Not Found | Recipe not found | `{"error": "Recipe not found with ID: 999999"}` |
| 429 Too Many Requests | Rate limit exceeded | `{"error": "Too many requests. Please try again later."}` |
| 500 Internal Server Error | Server or calculation error | `{"error": "An unexpected error occurred"}` |

**Implementation Notes:**
- Validates all ingredient IDs exist in the recipe
- Recalculates nutrition using hybrid approach (see [ADR-0010](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md)):
  1. **Primary:** Use ingredient-level nutrition data when available
  2. **Fallback:** Proportional estimation based on weight/volume
- Uses cached recipe data (no additional API call)
- Calculation happens in-memory (fast response)

**Validation Rules:**
- Recipe ID must be a positive integer
- `ingredientIds` array must contain at least one item
- All ingredient IDs must be positive integers
- All ingredient IDs must exist in the recipe's ingredient list

**Nutrition Calculation:**
- Weight-based proportion for accurate results
- Volume-to-weight conversion for volume-based ingredients
- Preserves nutrient relationships (percentage of daily values updated)
- See [Nutrition Calculation Documentation](../architecture/README.md#data-flow-ingredient-exclusion) for details

## Security

- **CORS:** Configured in `backend/src/main/resources/application.yaml`
- **Rate Limiting:** Applied per environment configuration
- **Input Validation:** All inputs sanitized and validated

## Related Documentation

See the [Documentation Index](../README.md) for all project documentation.
