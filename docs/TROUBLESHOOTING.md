# Troubleshooting Guide

Common issues and solutions for Luqma development.

## Table of Contents

- [Setup Issues](#setup-issues)
  - [Backend .env File Missing](#backend-env-file-missing)
  - [Permission Denied Errors](#permission-denied-errors)
- [Runtime Issues](#runtime-issues)
  - [Port Already in Use](#port-already-in-use)
  - [Frontend Can't Connect to Backend](#frontend-cant-connect-to-backend)
  - [Hot Reload Not Working](#hot-reload-not-working)
- [Build Issues](#build-issues)
  - [Gradle Build Fails](#gradle-build-fails)
  - [Frontend Dependencies Issues](#frontend-dependencies-issues)
- [API Issues](#api-issues)
  - [Spoonacular API Connection](#spoonacular-api-connection)
- [Configuration Issues](#configuration-issues)
  - [URLs Not Working After Changing Ports](#urls-not-working-after-changing-ports)
- [Getting More Help](#getting-more-help)

---

## Setup Issues

### Backend .env File Missing

**Error:** `.env file not found`

**Solution:**

```bash
# Copy .env.example files and configure
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit backend/.env and add your SPOONACULAR_API_KEY

# Then run setup
npm run setup
```

### Permission Denied Errors

**Solution:**

```bash
chmod +x backend/gradlew           # Gradle wrapper
chmod +x backend/scripts/*.sh      # Setup scripts
```

---

## Runtime Issues

### Port Already in Use

**Error:** "Port 8080/3000 is already in use"

**Solution:**

```bash
npm run stop                     # Stop services

# If that fails, manually kill processes
lsof -ti:8080 | xargs kill -9    # Backend (default port)
lsof -ti:3000 | xargs kill -9    # Frontend (default port)
```

**Alternative:** Use custom ports:

**Backend:** Edit `backend/src/main/resources/application.yaml` and change `server.port`

**Frontend:** Edit `frontend/vite.config.js` and change `server.port`, then update `LUQMA_API_URL` in `frontend/.env`

### Frontend Can't Connect to Backend

**Error:** "Failed to fetch" or CORS errors in browser console

**Solution:**

```bash
curl http://localhost:8080/actuator/health  # Check backend
npm run dev                                  # Ensure both running
```

**Check configuration:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. **Verify frontend API URL:**
   ```bash
   # Check frontend/.env
   cat frontend/.env | grep LUQMA_API_URL
   ```
   
   Should be: `LUQMA_API_URL=http://localhost:8080/api/v1` (or your custom backend URL)

3. **Check CORS configuration:**
   - Backend CORS is configured in `backend/src/main/resources/application.yaml`
   - Default allows `http://localhost:3000`
   - If using custom frontend port, update CORS origins in the YAML file

**Custom Configuration:**

If using custom ports, update both configurations:

```bash
# 1. Backend port - edit backend/src/main/resources/application.yaml
server:
  port: 9090

# 2. Frontend API URL - edit frontend/.env
LUQMA_API_URL=http://localhost:9090/api/v1

# 3. Frontend port - edit frontend/vite.config.js
server: {
  port: 4000
}
```

### Hot Reload Not Working

**Backend:**
- Restart: `npm run stop:backend && npm run dev:backend`
- Gradle bootRun doesn't support hot reload (Spring Boot DevTools configured)

**Frontend:**
- Should work automatically with Vite
- Check browser console for errors
- Hard refresh: `Ctrl+Shift+R` (Linux/Windows) or `Cmd+Shift+R` (Mac)

---

## Build Issues

### Gradle Build Fails

**Solution:**

```bash
cd backend
./gradlew clean build
java -version  # Verify Java 25+

# If still failing, clear cache
rm -rf ~/.gradle/caches/
./gradlew clean build --refresh-dependencies
```

### Frontend Dependencies Issues

**Error:** `sh: 1: patch-package: not found` or `npm error code 127`

**Solution:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --ignore-scripts
node -v  # Verify Node.js 24+

# If still failing, clear cache
npm cache clean --force
npm install --ignore-scripts
```

**Note:** The `--ignore-scripts` flag bypasses problematic postinstall scripts from some dependencies (like rollup) that expect `patch-package` to be available.

---


## API Issues

### Spoonacular API Connection

**Solution:**

```bash
cat backend/.env | grep SPOONACULAR_API_KEY  # Verify key
```

**Check rate limits:**
- Free tier: 150 requests/day
- Usage dashboard: https://spoonacular.com/food-api/console#Dashboard

**Note:** The application is fully integrated with Spoonacular API via `SpoonacularClient`. Mock data in `backend/src/main/resources/mocks/` is retained for testing purposes only.

---

## Configuration Issues

### URLs Not Working After Changing Ports

**Solution:**

1. **Update backend port:**
   - Edit `backend/src/main/resources/application.yaml`
   - Change `server.port` value

2. **Update frontend configuration:**
   - Edit `frontend/.env` and update `LUQMA_API_URL` to match backend
   - Edit `frontend/vite.config.js` to change frontend port if needed

3. **Restart all services:**
   ```bash
   npm run stop
   npm run dev
   ```

## Getting More Help

### Check Logs

- **Backend:** Console output from `npm run dev`
- **Frontend:** Browser console (F12) and terminal

### Verify Configuration

```bash
# Check backend configuration
cat backend/.env

# Check frontend configuration
cat frontend/.env
```

### Verify Prerequisites

Java 25+ • Node.js 24+ • npm 10+

### Try a Clean Restart

```bash
npm run stop
cd backend && ./gradlew clean && cd ..
cd frontend && rm -rf node_modules && npm install --ignore-scripts && cd ..
npm run dev
```

### Community Support

- [GitHub Issues](https://github.com/ahmadshalabi/luqma/issues)
- When creating an issue, include: error messages, environment (OS, Java/Node versions), reproduction steps

