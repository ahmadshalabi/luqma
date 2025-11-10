# Recipe Search Endpoint

Search recipes with pagination.

## Endpoint

```
GET /api/v1/recipes/search
```

---

## Request

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Search term |
| `page` | integer | No | 1 | Page number (1-indexed) |
| `pageSize` | integer | No | 9 | Results per page (1-100) |

### Example

```bash
curl "http://localhost:8080/api/v1/recipes/search?query=pasta&page=1&pageSize=9"
```

---

## Response

```json
{
  "recipes": [
    {
      "id": 654959,
      "title": "Pasta with Garlic, Scallions, and...",
      "image": "https://img.spoonacular.com/recipes/654959-312x231.jpg",
      "nutrition": {
        "calories": 584.79,
        "protein": 19.31,
        "fat": 17.51,
        "carbs": 83.80
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 9,
    "totalResults": 87
  }
}
```

---

## Fields

**Recipe object:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Recipe ID |
| `title` | string | Recipe name |
| `image` | string | Image URL |
| `nutrition` | object | Nutritional summary |

**Pagination object:**
| Field | Type | Description |
|-------|------|-------------|
| `page` | integer | Current page |
| `pageSize` | integer | Results per page |
| `totalResults` | integer | Total matching recipes |

---

## Examples

### Basic Search

```bash
curl "http://localhost:8080/api/v1/recipes/search?query=chicken"
```

### Pagination

```bash
# Page 1
curl "http://localhost:8080/api/v1/recipes/search?query=chicken&page=1&pageSize=10"

# Page 2
curl "http://localhost:8080/api/v1/recipes/search?query=chicken&page=2&pageSize=10"
```

### Custom Page Size

```bash
curl "http://localhost:8080/api/v1/recipes/search?query=salad&pageSize=20"
```

---

## Errors

### 400 Bad Request

```bash
# Missing query
curl "http://localhost:8080/api/v1/recipes/search?page=1"
# Error: Query parameter is required

# Invalid page size
curl "http://localhost:8080/api/v1/recipes/search?query=pasta&pageSize=200"
# Error: Page size must be between 1 and 100
```

---

## Testing

**See [API Testing Guide](README.md#testing-the-api) for Swagger UI instructions.**

### cURL Examples

```bash
# Valid request
curl -i "http://localhost:8080/api/v1/recipes/search?query=pasta&page=1&pageSize=9"

# Missing query (should fail)
curl -i "http://localhost:8080/api/v1/recipes/search?page=1"

# Invalid page size (should cap at 100)
curl -i "http://localhost:8080/api/v1/recipes/search?query=pasta&pageSize=200"
```

### Integration Tests

**Location:** `backend/src/test/java/app/luqma/backend/controller/RecipeControllerTest.java`

---

## Frontend Integration

**See:** `frontend/src/services/apiClient.js` - `searchRecipes()` function

---

## Performance

**Response time:** 200-500ms (depends on Spoonacular API)

**Not cached** - Search results are always fresh

**Best practices:**
- Use reasonable page sizes (9-20)
- Implement debouncing (300ms)
- Show loading states

---

## Related

- [Recipe Details Endpoint](endpoints-details.md)
- [Error Handling](error-handling.md)
- [Frontend Architecture](../architecture/frontend-architecture.md)
