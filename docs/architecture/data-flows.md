# Data Flows

Request flows through Luqma.

## Recipe Search Flow

```
User Input (SearchBar)
  ↓ 300ms debounce
Frontend (useSearch)
  ↓ GET /api/v1/recipes/search
Backend Controller
  ↓
Service Layer
  ↓
Spoonacular API
  ↓
Response → Frontend → Display Results
```

**Key points:**
- Debounced 300ms for performance
- Not cached (always fresh)
- URL state synced (shareable)
- Response time: 200-500ms

---

## Recipe Details Flow

```
User Clicks Recipe
  ↓
Frontend (useRecipeDetail)
  ↓ GET /api/v1/recipes/{id}
Backend Controller
  ↓
Repository (Check Cache)
  ├─ Cache Hit → Return (< 10ms)
  └─ Cache Miss → Spoonacular API → Cache → Return (200-500ms)
  ↓
Response → Frontend → Display Details
```

**Key points:**
- Cached 1 hour
- 80% cache hit rate
- Sub-millisecond for cached

---

## Ingredient Exclusion Flow

```
User Excludes Ingredients
  ↓
Frontend (useRecipeExclusion)
  ↓ POST /api/v1/recipes/{id}/exclude-ingredients
Backend Controller
  ↓
Fetch Recipe (from cache if available)
  ↓
Nutrition Calculation Service
  ├─ Try ingredient-level calculation
  └─ Fallback to proportional estimation
  ↓
Response → Frontend → Update UI
```

**Key points:**
- Not cached (computed on-demand)
- Hybrid calculation
- Response time: < 100ms

**See:** [ADR-0010](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md)

---

## Error Flow

```
Request → Backend
  ↓
Validation/Processing
  ├─ Success → Return data
  └─ Error → GlobalExceptionHandler
      ↓
      Format error response
      ↓
      Return with status code
```

**Error handling:**
- Generic messages to client
- Detailed logs server-side
- Consistent error format
- Appropriate HTTP status codes

---

## Related

- [Backend Architecture](backend-architecture.md)
- [Frontend Architecture](frontend-architecture.md)
- [Caching Strategy](caching-strategy.md)
