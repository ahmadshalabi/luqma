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
