# API Documentation

REST API reference for Luqma backend.

## Interactive Documentation

**Swagger UI:** http://localhost:8080/swagger-ui.html (when running)

---

## Overview

**Base URL:** `http://localhost:8080/api/v1`

**Features:**
- Recipe search with pagination
- Detailed recipe information
- Dynamic ingredient exclusion
- Automatic nutrition recalculation
- Caching for performance
- Rate limiting

**Data Source:** [Spoonacular API](https://spoonacular.com/food-api)  
**Setup:** [Configuration Guide](../guides/configuration.md#getting-a-spoonacular-api-key)

---

## Endpoints

| Method | Endpoint | Description | Docs |
|--------|----------|-------------|------|
| `GET` | `/recipes/search` | Search recipes | [Details](endpoints-search.md) |
| `GET` | `/recipes/{id}` | Get recipe details | [Details](endpoints-details.md) |
| `POST` | `/recipes/{id}/exclude-ingredients` | Exclude ingredients | [Details](endpoints-exclusion.md) |

---

## Quick Examples

### Search Recipes

```bash
curl "http://localhost:8080/api/v1/recipes/search?query=pasta&page=1&pageSize=9"
```

**Response:**
```json
{
  "recipes": [...],
  "pagination": {
    "page": 1,
    "pageSize": 9,
    "totalResults": 87
  }
}
```

---

### Get Recipe Details

```bash
curl "http://localhost:8080/api/v1/recipes/715497"
```

**Response:**
```json
{
  "id": 715497,
  "title": "Strawberry Banana Smoothie",
  "ingredients": [...],
  "nutrition": {
    "calories": 314.43,
    ...
  }
}
```

---

### Exclude Ingredients

```bash
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [9040]}'
```

**Response:** Recipe with updated nutrition

**Note:** Uses hybrid calculation (ingredient-level or proportional). See [ADR-0010](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md)

---

## Security

**API Key Protection:**
- Spoonacular API key stored in backend only
- Frontend never has access to API key
- All external API calls proxied through backend

**CORS:**
- Default: `http://localhost:3000`
- Configure: `application.yaml`

**Rate Limiting:**
- Backend: 100 requests/minute per IP
- Spoonacular: 150 requests/day (free tier)

---

## Rate Limits

### Backend Rate Limit

**Limit:** 100 requests per minute per IP

**Response (429):**
```json
{
  "status": 429,
  "message": "Rate limit exceeded. Try again in 60 seconds.",
  "timestamp": "2025-11-10T10:30:00Z"
}
```

**Reset:** After 60 seconds

### Spoonacular API Rate Limit

**Free Tier:** 150 requests per day

**Response (429):**
```json
{
  "status": 429,
  "message": "Spoonacular API quota exceeded",
  "timestamp": "2025-11-10T10:30:00Z"
}
```

**Monitor:** [Spoonacular Dashboard](https://spoonacular.com/food-api/console#Dashboard)

**Reset:** After 24 hours

---

## Error Handling

**All errors return:**
```json
{
  "status": 400,
  "message": "Error description",
  "timestamp": "2025-11-10T10:30:00Z",
  "path": "/api/v1/...",
  "fieldErrors": {...}  // Optional
}
```

**Common errors:**
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (recipe doesn't exist)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error
- `502` - Bad Gateway (external API error)

**See:** [Error Handling Guide](error-handling.md)

---

## Testing the API

### Using Swagger UI

1. Start backend: `./gradlew bootRun`
2. Open http://localhost:8080/swagger-ui.html
3. Click "Try it out" on any endpoint
4. Enter parameters and execute

### Using cURL

```bash
# Search
curl "http://localhost:8080/api/v1/recipes/search?query=pasta"

# Details
curl "http://localhost:8080/api/v1/recipes/715497"

# Exclude
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [9040]}'
```

### Frontend Integration

**See:** `frontend/src/services/apiClient.js`

---

## Related Documentation

- [Recipe Search](endpoints-search.md)
- [Recipe Details](endpoints-details.md)
- [Ingredient Exclusion](endpoints-exclusion.md)
- [Error Handling](error-handling.md)
- [ADR-0009](../decisions/0009-implement-layered-architecture-in-backend.md) - Layered architecture
- [ADR-0010](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md) - Nutrition calculation
- [Troubleshooting](../TROUBLESHOOTING.md)
- [Development Workflow](../guides/development-workflow.md)
