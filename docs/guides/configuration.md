# Configuration

Configuration reference for Luqma.

## Backend

### Environment Variables

File: `backend/.env`

```bash
SPOONACULAR_API_KEY=your_key_here
SPRING_PROFILES_ACTIVE=dev  # or prod
```

**Get Spoonacular API Key:**
1. Sign up: https://spoonacular.com/food-api
2. Dashboard: https://spoonacular.com/food-api/console#Dashboard
3. Free tier: 150 requests/day

### Profiles

**Development (`dev`):**
- Verbose logging
- Detailed errors
- Open CORS

**Production (`prod`):**
- Minimal logging
- Generic errors  
- Restricted CORS

**Mock (`mock`):**
- Offline development without API key
- Uses local mock data
- Simulated latency and errors
- Verbose logging with stack traces

### Ports

**Default:** 8080

**Change:** Edit `backend/src/main/resources/application.yaml`
```yaml
server:
  port: 9090
```

### CORS

**Default:** `http://localhost:3000`

**Change:** Edit `application.yaml`
```yaml
cors:
  allowed-origins: http://localhost:4000
```

### Cache

**Defaults:**
- TTL: 1 hour
- Max size: 500 recipes
- Eviction: LRU

**Change:** Edit `application.yaml`
```yaml
cache:
  caffeine:
    spec: maximumSize=1000,expireAfterWrite=7200s
```

### Rate Limiting

**Default:** 100 requests/minute per IP

**Change:** See `RateLimitFilter.java`

### Mock Profile

Use mock mode for offline development without a Spoonacular API key.

**Activate:**
```bash
# Root level
npm run dev:mock

# Backend only
cd backend
./gradlew bootRun --args='--spring.profiles.active=mock'
```

**Configuration:**
File: `backend/src/main/resources/application-mock.yaml`

```yaml
mock:
  # Latency simulation - mimics real API response times
  latency:
    enabled: true           # Enable latency simulation
    min-millis: 100         # Minimum latency in milliseconds
    max-millis: 500         # Maximum latency in milliseconds
  
  # Error simulation - test error handling
  errors:
    enabled: false          # Disable by default
    rate: 0.0               # Error rate (0.0-1.0)
```

**Features:**
- No API key required
- Uses sample data from `backend/src/main/resources/mocks/`
- Configurable latency simulation (default: 100-500ms)
- Optional error injection for testing
- Full stack traces for debugging
- CORS configured for both localhost:3000 and localhost:5173

**When to use:**
- Development without Spoonacular API key
- Offline development
- Conserving API quota
- Testing with consistent, predictable data
- Error handling scenarios (with errors.enabled = true)

---

## Frontend

### Environment Variables

File: `frontend/.env`

```bash
LUQMA_API_URL=http://localhost:8080/api/v1
```

**Optional.** Defaults to `http://localhost:8080/api/v1` if not set.

### Ports

**Default:** 3000

**Change:** Edit `frontend/vite.config.js`
```javascript
server: {
  port: 4000
}
```

---

## Custom Ports Example

**Backend on 9090, Frontend on 4000:**

1. Backend: `application.yaml`
```yaml
server:
  port: 9090

cors:
  allowed-origins: http://localhost:4000
```

2. Frontend: `.env`
```bash
LUQMA_API_URL=http://localhost:9090/api/v1
```

3. Frontend: `vite.config.js`
```javascript
server: {
  port: 4000
}
```

---

## Production

### Backend

```bash
# backend/.env
SPOONACULAR_API_KEY=your_prod_key
SPRING_PROFILES_ACTIVE=prod
```

```yaml
# application-prod.yaml
server:
  port: 8080

cors:
  allowed-origins: https://yourdomain.com

logging:
  level:
    root: WARN
```

### Frontend

```bash
# frontend/.env.production
LUQMA_API_URL=https://api.yourdomain.com/api/v1
```

**Build:**
```bash
npm run build
# Output: dist/
```

---

## Troubleshooting

**Port in use:**
```bash
lsof -ti:8080 | xargs kill -9
```

**Backend can't connect:**
- Check `SPOONACULAR_API_KEY` is set
- Verify network connectivity
- Check Spoonacular quota

**CORS errors:**
- Verify `cors.allowed-origins` matches frontend URL
- Check protocol (http vs https)

**Cache not working:**
- Check `@EnableCaching` in config
- Verify Caffeine dependency

More: [Troubleshooting Guide](../TROUBLESHOOTING.md)
