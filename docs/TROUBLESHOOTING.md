# Troubleshooting

Common issues and solutions.

## Setup Issues

### Missing .env File

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Add SPOONACULAR_API_KEY to backend/.env
```

### Permission Denied

```bash
chmod +x backend/gradlew
```

---

## Runtime Issues

### Port Already in Use

```bash
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Backend Won't Start

**Check:**
1. Java version: `java -version` (need 25+)
2. Port available: `lsof -i:8080`
3. `.env` file exists and has `SPOONACULAR_API_KEY`

**Logs:**
```bash
tail -f backend/logs/application.log
```

### Frontend Won't Start

**Check:**
1. Node version: `node -v` (need 24+)
2. Port available: `lsof -i:3000`
3. Dependencies installed: `npm install`

**Clear and retry:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Build Issues

### Backend Build Fails

```bash
./gradlew clean build --refresh-dependencies
```

**If tests fail:**
```bash
./gradlew build -x test
```

### Frontend Build Fails

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## API Issues

### 401 Unauthorized

**Cause:** Invalid Spoonacular API key

**Fix:**
1. Check `backend/.env` has valid `SPOONACULAR_API_KEY`
2. Verify key at: https://spoonacular.com/food-api/console#Dashboard
3. Restart backend

### 429 Too Many Requests

**Cause:** Rate limit exceeded

**Fix:**
- Wait 60 seconds (backend limit)
- Wait 24 hours (Spoonacular free tier limit)
- Check usage: https://spoonacular.com/food-api/console#Dashboard

### 500 Internal Server Error

**Check logs:**
```bash
tail -f backend/logs/application.log
```

**Common causes:**
- Spoonacular API down
- Network connectivity
- Invalid data format

### CORS Errors

**Fix:** Update `backend/src/main/resources/application.yaml`
```yaml
cors:
  allowed-origins: http://localhost:3000  # Match frontend URL
```

---

## Configuration Issues

### Backend Can't Connect to Spoonacular

**Check:**
1. API key is valid
2. Network connectivity: `curl https://api.spoonacular.com`
3. Not over quota

### Cache Not Working

**Verify:**
1. `@EnableCaching` in configuration
2. Caffeine dependency present
3. Check logs for cache hits/misses

---

## Performance Issues

### Slow API Responses

**Check:**
- Spoonacular API response time
- Cache is working
- Network latency

**Monitor:**
```bash
time curl "http://localhost:8080/api/v1/recipes/715497"
```

### Frontend Slow Loading

**Check:**
- Bundle size: `npm run build`
- Network tab in browser DevTools
- Disable extensions

---

## Getting Help

1. **Check logs:**
   - Backend: `backend/logs/application.log`
   - Frontend: Browser console
   
2. **Test endpoints:**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

3. **Verify configuration:** [Configuration Guide](guides/configuration.md)

4. **Review documentation:** [Documentation Index](README.md)
