# Recipe Details Endpoint

Get full recipe information with nutrition data.

## Endpoint

```
GET /api/v1/recipes/{id}
```

---

## Request

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Recipe ID (required, positive) |

### Example

```bash
curl "http://localhost:8080/api/v1/recipes/715497"
```

---

## Response

```json
{
  "id": 715497,
  "title": "Strawberry Banana Smoothie",
  "image": "https://img.spoonacular.com/recipes/715497-312x231.jpg",
  "servings": 2,
  "readyInMinutes": 5,
  "summary": "A healthy and delicious smoothie...",
  "instructions": "Combine all ingredients in blender...",
  "ingredients": [
    {
      "id": 9316,
      "name": "Strawberries",
      "amount": 200,
      "unit": "g",
      "image": "strawberries.jpg"
    },
    {
      "id": 9040,
      "name": "Banana",
      "amount": 150,
      "unit": "g",
      "image": "bananas.jpg"
    }
  ],
  "nutrition": {
    "calories": 314.43,
    "protein": 5.2,
    "fat": 2.4,
    "carbs": 70.0,
    "fiber": 8.5,
    "sugar": 42.0
  }
}
```

---

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Recipe ID |
| `title` | string | Recipe name |
| `image` | string | Image URL |
| `servings` | integer | Number of servings |
| `readyInMinutes` | integer | Preparation time |
| `summary` | string | Recipe description (HTML) |
| `instructions` | string | Cooking steps (HTML) |
| `ingredients` | array | List of ingredients with nutrition |
| `nutrition` | object | Nutritional information |

---

## Caching

**TTL:** 1 hour  
**Max size:** 500 recipes  
**Eviction:** LRU

**Cache hit:**
- Response time: <10ms
- No external API call

**Cache miss:**
- Response time: 200-500ms
- Calls Spoonacular API

---

## Examples

### Get Recipe

```bash
curl "http://localhost:8080/api/v1/recipes/715497"
```

### Test Caching

```bash
# First call (cache miss, slower)
time curl "http://localhost:8080/api/v1/recipes/715497"

# Second call (cache hit, faster)
time curl "http://localhost:8080/api/v1/recipes/715497"
```

### Extract Specific Data

```bash
# Get only calories
curl "http://localhost:8080/api/v1/recipes/715497" | jq '.nutrition.calories'

# Get ingredient IDs
curl "http://localhost:8080/api/v1/recipes/715497" | jq '.ingredients[].id'
```

---

## Errors

### 400 Bad Request

```bash
curl "http://localhost:8080/api/v1/recipes/-1"
# Error: Recipe ID must be positive

curl "http://localhost:8080/api/v1/recipes/abc"
# Error: Invalid ID format
```

### 404 Not Found

```bash
curl "http://localhost:8080/api/v1/recipes/999999999"
# Error: Recipe not found
```

---

## Testing

**See [API Testing Guide](README.md#testing-the-api) for Swagger UI instructions.**

### cURL Examples

```bash
# Valid request
curl -i "http://localhost:8080/api/v1/recipes/715497"

# Invalid ID
curl -i "http://localhost:8080/api/v1/recipes/-1"

# Non-existent
curl -i "http://localhost:8080/api/v1/recipes/999999999"

# Cache test
time curl "http://localhost:8080/api/v1/recipes/715497"
time curl "http://localhost:8080/api/v1/recipes/715497"
```

### Integration Tests

**Location:** `backend/src/test/java/app/luqma/backend/`
- `controller/RecipeControllerTest.java`
- `service/RecipeDetailServiceTest.java`
- `repository/RecipeRepositoryTest.java`

---

## Frontend Integration

**See:**
- `frontend/src/services/apiClient.js` - `getRecipeById()` function
- `frontend/src/hooks/useRecipeDetail.js` - React hook

---

## Performance

| Metric | Value |
|--------|-------|
| Cache hit | <10ms |
| Cache miss | 200-500ms |
| Cache TTL | 1 hour |
| Max cached | 500 recipes |

---

## Related

- [Recipe Search Endpoint](endpoints-search.md)
- [Ingredient Exclusion Endpoint](endpoints-exclusion.md)
- [Caching Strategy](../architecture/caching-strategy.md)
- [Error Handling](error-handling.md)
