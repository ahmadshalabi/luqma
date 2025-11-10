# Ingredient Exclusion Endpoint

Exclude ingredients and recalculate nutrition.

## Endpoint

```
POST /api/v1/recipes/{id}/exclude-ingredients
```

---

## Request

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Recipe ID (required, positive) |

### Body

```json
{
  "ingredientIds": [9040, 1116]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ingredientIds` | array | Yes | List of ingredient IDs to exclude (non-empty) |

---

## Response

```json
{
  "id": 715497,
  "title": "Strawberry Banana Smoothie",
  "excludedIngredients": [
    {"id": 9040, "name": "Banana"},
    {"id": 1116, "name": "Yogurt"}
  ],
  "ingredients": [
    {"id": 9316, "name": "Strawberries", "amount": 200, "unit": "g"}
  ],
  "nutrition": {
    "calories": 157.85,
    "protein": 2.5,
    "fat": 1.2,
    "carbs": 35.0
  }
}
```

---

## Nutrition Recalculation

**Hybrid approach:**
1. **Ingredient-level** (preferred): Sum remaining ingredient nutrition
2. **Proportional fallback**: Estimate based on weight removed

**Formula (proportional):**
```
New Calories = Original × (1 - Weight Excluded / Total Weight)
```

**See:** [ADR-0010](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md)

---

## Examples

### Basic Exclusion

```bash
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [9040, 1116]}'
```

### Check Before/After

```bash
# Before
curl "http://localhost:8080/api/v1/recipes/715497" | jq '.nutrition.calories'
# 314.43

# Exclude
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [9040]}' | jq '.nutrition.calories'
# ~157.85
```

---

## Errors

### 400 Bad Request

**Empty array:**
```bash
{"ingredientIds": []}
# Error: At least one ingredient ID required
```

**Invalid ID:**
```bash
{"ingredientIds": [99999]}
# Error: Invalid ingredient ID: 99999
```

### 404 Not Found

```bash
POST /api/v1/recipes/999999/exclude-ingredients
# Error: Recipe not found
```

---

## Testing

**See [API Testing Guide](README.md#testing-the-api) for Swagger UI instructions.**

### cURL Examples

```bash
# Get original recipe
curl "http://localhost:8080/api/v1/recipes/715497" | jq '.nutrition.calories'

# Exclude ingredients
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [9040, 1116]}' | jq '.nutrition.calories'

# Test invalid ID
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [99999]}'

# Test empty array
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": []}'
```

### Integration Tests

**Location:** `backend/src/test/java/app/luqma/backend/`
- `controller/RecipeControllerTest.java`
- `service/NutritionCalculationServiceTest.java`
- `service/NutritionCalculationServiceProportionalTest.java`

---

## Frontend Integration

**See:** 
- `frontend/src/services/apiClient.js` - `excludeIngredients()` function
- `frontend/src/hooks/useRecipeExclusion.js` - React hook

---

## Performance

**Not cached** - Calculated on-demand for each request.

**Response time:** <100ms (in-memory calculation)

---

## Related

- [Recipe Details Endpoint](endpoints-details.md)
- [Nutrition Calculation ADR](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md)
- [Error Handling](error-handling.md)
