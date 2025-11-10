# Caching Strategy

Spring Cache with Caffeine for performance.

## Configuration

**Cache Provider:** Caffeine  
**Implementation:** Spring Cache (`@Cacheable`)

**Settings:**
```yaml
# application.yaml
spring:
  cache:
    type: caffeine
    cache-names: recipes

cache:
  caffeine:
    spec: maximumSize=500,expireAfterWrite=3600s
```

| Setting | Value | Description |
|---------|-------|-------------|
| `maximumSize` | 500 | Max recipes cached |
| `expireAfterWrite` | 3600s | TTL: 1 hour |
| Eviction | LRU | Least Recently Used |

---

## What's Cached

**Recipe Details:**
- Endpoint: `GET /api/v1/recipes/{id}`
- Key: Recipe ID
- TTL: 1 hour
- Max: 500 recipes

**Not Cached:**
- Recipe search (always fresh)
- Ingredient exclusion (computed on-demand)

---

## Implementation

**Repository Layer:**
```java
@Cacheable(value = "recipes", key = "#id")
public RecipeDetailResponse findById(Long id)
```

**See:** `backend/src/main/java/app/luqma/backend/repository/RecipeRepository.java`

---

## Benefits

**Performance:**
- Cache hit: < 10ms (vs 200-500ms)
- 80% reduction in API calls
- Better user experience

**Cost:**
- Reduces Spoonacular API usage
- Stays within free tier limits

---

## Monitoring

**Logs show cache activity:**
```
Cache hit: recipes::715497
Cache miss: recipes::654959
```

**Metrics:**
- Hit rate: ~80%
- Miss rate: ~20%

---

## Management

**Clear cache:**
```bash
# Restart backend
sudo systemctl restart luqma-backend

# Or programmatically via CacheManager
```

**Adjust settings:** Edit `application.yaml` and restart

---

## Related

- [Backend Architecture](backend-architecture.md)
- [System Overview](system-overview.md)
- [Configuration](../guides/configuration.md)
