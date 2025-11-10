# Error Handling

API error responses and troubleshooting.

## Error Response Format

```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2025-11-10T10:30:00Z",
  "path": "/api/v1/recipes/search",
  "fieldErrors": {
    "query": "Query parameter is required"
  }
}
```

---

## Error Codes

### 400 Bad Request

**Causes:**
- Missing required parameters
- Invalid parameter values
- Validation failures

**Examples:**
```bash
# Missing query
GET /api/v1/recipes/search

# Invalid page size
GET /api/v1/recipes/search?query=pasta&pageSize=101

# Invalid ingredient IDs
POST /api/v1/recipes/{id}/exclude-ingredients
{"ingredientIds": []}
```

**Fix:** Check request parameters and validation rules.

---

### 404 Not Found

**Causes:**
- Recipe ID doesn't exist
- Invalid endpoint URL

**Examples:**
```bash
GET /api/v1/recipes/999999  # Non-existent recipe
GET /api/v1/invalid         # Wrong endpoint
```

**Fix:** Verify recipe ID exists, check endpoint URL.

---

### 429 Too Many Requests

**Causes:**
- Exceeded rate limit (100 req/min)
- Spoonacular quota exceeded

**Response:**
```json
{
  "status": 429,
  "message": "Rate limit exceeded",
  "timestamp": "2025-11-10T10:30:00Z"
}
```

**Fix:** Wait 60 seconds, implement exponential backoff.

---

### 500 Internal Server Error

**Causes:**
- Server error
- Database connection issues
- External API failures

**Response:**
```json
{
  "status": 500,
  "message": "An error occurred",
  "timestamp": "2025-11-10T10:30:00Z"
}
```

**Fix:** Check server logs, retry request, contact support.

---

### 502 Bad Gateway

**Causes:**
- Spoonacular API down
- Network timeout
- External service error

**Fix:** Wait and retry, check Spoonacular status.

---

## Common Scenarios

### Empty Query

```bash
curl "http://localhost:8080/api/v1/recipes/search"
# 400: Query parameter is required
```

### Invalid Recipe ID

```bash
curl "http://localhost:8080/api/v1/recipes/-1"
# 400: Recipe ID must be positive

curl "http://localhost:8080/api/v1/recipes/999999"
# 404: Recipe not found
```

### Invalid Ingredient Exclusion

```bash
curl -X POST "http://localhost:8080/api/v1/recipes/715497/exclude-ingredients" \
  -H "Content-Type: application/json" \
  -d '{"ingredientIds": [99999]}'
# 400: Invalid ingredient ID
```

### Rate Limit Exceeded

```bash
# After 100 requests in 1 minute
curl "http://localhost:8080/api/v1/recipes/search?query=pasta"
# 429: Rate limit exceeded. Try again in 60 seconds.
```

---

## Frontend Error Handling

**Pattern:**
```javascript
try {
  const data = await apiClient.searchRecipes(query);
  return data;
} catch (error) {
  if (error.status === 429) {
    // Show rate limit message
  } else if (error.status === 404) {
    // Show not found message
  } else {
    // Show generic error
  }
}
```

**See:** `frontend/src/services/apiClient.js` for implementation.

---

## Debugging

### Check Request

```bash
curl -v "http://localhost:8080/api/v1/recipes/search?query=pasta"
```

### Check Logs

```bash
# Backend logs
tail -f backend/logs/application.log

# Or Docker:
docker logs -f luqma-backend
```

### Test Connectivity

```bash
curl http://localhost:8080/actuator/health
```

---

## Best Practices

**Client-side:**
- Validate before sending requests
- Implement retry with exponential backoff
- Show user-friendly error messages
- Log errors for debugging

**Server-side:**
- Never expose stack traces
- Log detailed errors internally
- Return consistent error format
- Set appropriate HTTP status codes

---

More: [Troubleshooting Guide](../TROUBLESHOOTING.md)
